/**
 * InviteSSEClient — bọc fetch streaming để nhận SSE event từ
 * GET /couple/invite/:code/watch.
 *
 * React Native (Hermes) không có EventSource built-in, nên dùng
 * fetch + ReadableStream reader để đọc SSE text/event-stream.
 *
 * Tại sao không dùng thư viện ngoài:
 *   - Giao thức SSE đơn giản, không cần full EventSource polyfill
 *   - Giữ đúng luật "bọc thư viện 3rd-party qua adapter riêng"
 *   - Dễ test và swap nếu sau này chuyển sang WebSocket
 */

/** Payload server push khi partner accept invite. */
export interface InviteAcceptedPayload {
  coupleId: string;
  /** Tên partner — dùng để hiển thị trong Connected screen */
  partnerName?: string;
  /** Ngày bắt đầu couple — ISO string */
  startDate?: string;
}

/** Callback gọi khi server gửi event "accepted". */
export type InviteAcceptedCallback = (payload: InviteAcceptedPayload) => void;

export interface IInviteSSEClient {
  /**
   * Mở SSE connection tới endpoint /couple/invite/:code/watch.
   * Tự động gọi onAccepted khi nhận event "accepted".
   * Trả về hàm cleanup để đóng connection (gọi khi unmount).
   */
  watch(code: string, onAccepted: InviteAcceptedCallback): () => void;
}

// ── SSE parser ────────────────────────────────────────────────────────────────

interface SSEEvent {
  event: string;
  data: string;
}

/**
 * Parse raw SSE text thành danh sách events.
 * SSE format: "event: xxx\ndata: yyy\n\n"
 */
function parseSSEChunk(chunk: string): SSEEvent[] {
  const events: SSEEvent[] = [];
  // Mỗi event phân cách bởi double newline
  const blocks = chunk.split('\n\n');
  for (const block of blocks) {
    if (!block.trim()) continue;
    let event = 'message';
    let data = '';
    for (const line of block.split('\n')) {
      if (line.startsWith('event:')) {
        event = line.slice(6).trim();
      } else if (line.startsWith('data:')) {
        data = line.slice(5).trim();
      }
    }
    events.push({ event, data });
  }
  return events;
}

// ── Impl ──────────────────────────────────────────────────────────────────────

export class InviteSSEClient implements IInviteSSEClient {
  constructor(
    private readonly baseURL: string,
    private readonly getToken: () => Promise<string | null>,
  ) {}

  watch(code: string, onAccepted: InviteAcceptedCallback): () => void {
    const controller = new AbortController();

    // Chạy bất đồng bộ — không block constructor
    this.connect(code, onAccepted, controller.signal).catch(() => {
      // Lỗi mạng / abort — bỏ qua, cleanup đã được xử lý qua AbortController
    });

    return () => controller.abort();
  }

  private async connect(
    code: string,
    onAccepted: InviteAcceptedCallback,
    signal: AbortSignal,
  ): Promise<void> {
    const token = await this.getToken();
    const url = `${this.baseURL}/couple/invite/${encodeURIComponent(code)}/watch`;

    const headers: Record<string, string> = {
      Accept: 'text/event-stream',
      'Cache-Control': 'no-cache',
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    // Dev: ngrok cần header này để không hiện trang warning
    if (process.env.EXPO_PUBLIC_APP_ENV === 'development') {
      headers['ngrok-skip-browser-warning'] = 'true';
    }

    const response = await fetch(url, { headers, signal });

    // Hermes hỗ trợ response.body (ReadableStream) nhưng expo tsconfig
    // dùng lib: ["ES2022"] nên không có DOM types — cast để thoả mãn tsc.
    interface RNResponse { body: { getReader(): { read(): Promise<{ done: boolean; value: Uint8Array }>; cancel(): void } } | null }
    const body = (response as unknown as RNResponse).body;
    if (!response.ok || !body) return;

    const reader = body.getReader();
    // TextDecoder có sẵn trên Hermes nhưng không trong ES2022 lib — khai báo cục bộ
    interface TextDecoderLike { decode(value?: Uint8Array, options?: { stream?: boolean }): string }
    const TextDecoderCtor = (globalThis as unknown as { TextDecoder: new () => TextDecoderLike }).TextDecoder;
    const decoder = new TextDecoderCtor();
    // Buffer để xử lý trường hợp event bị split qua nhiều chunk
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      // Flush tất cả event hoàn chỉnh (kết thúc bằng \n\n)
      const boundary = buffer.lastIndexOf('\n\n');
      if (boundary === -1) continue;

      const complete = buffer.slice(0, boundary + 2);
      buffer = buffer.slice(boundary + 2);

      for (const ev of parseSSEChunk(complete)) {
        if (ev.event === 'accepted') {
          try {
            const parsed = JSON.parse(ev.data) as {
              couple_id: string;
              partner_name?: string;
              start_date?: string;
            };
            onAccepted({
              coupleId: parsed.couple_id,
              partnerName: parsed.partner_name,
              startDate: parsed.start_date,
            });
          } catch {
            onAccepted({ coupleId: '' });
          }
          // Đóng connection sau khi nhận accepted — không cần đọc thêm
          reader.cancel();
          return;
        }
        // event "ping" — bỏ qua, chỉ có tác dụng giữ connection sống
      }
    }
  }
}
