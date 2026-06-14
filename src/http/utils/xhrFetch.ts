/**
 * fetch tối giản dựa trên XMLHttpRequest (RN-native).
 *
 * Lý do tồn tại: trên Expo SDK 53+, global `fetch` là expo/fetch — KHÔNG hỗ trợ
 * file-part dạng `{ uri, name, type }` của React Native FormData (ném
 * "Unsupported FormDataPart implementation"). XHR của RN upload file theo uri
 * native (stream thẳng từ đĩa), nên dùng riêng cho request multipart.
 *
 * Trả về `Response` chuẩn để tương thích với parseResponse/HttpError.
 */
interface XhrInit {
  method?: string;
  headers?: Record<string, string>;
  body?: FormData;
  signal?: AbortSignal;
}

export function xhrFetch(url: string, init: XhrInit = {}): Promise<Response> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(init.method ?? 'GET', url);

    for (const [key, value] of Object.entries(init.headers ?? {})) {
      // Bỏ Content-Type để XHR tự set boundary multipart đúng chuẩn.
      if (key.toLowerCase() === 'content-type') continue;
      xhr.setRequestHeader(key, value);
    }

    // Gỡ listener abort khi request kết thúc (mọi nhánh) → tránh rò rỉ trên
    // signal được tái dùng/sống lâu (vd upload avatar lặp lại nhiều lần).
    const onAbort = () => xhr.abort();
    const cleanup = () => init.signal?.removeEventListener('abort', onAbort);

    xhr.onloadend = cleanup;

    xhr.onload = () => {
      const headers = new Headers();
      xhr
        .getAllResponseHeaders()
        .trim()
        .split(/[\r\n]+/)
        .forEach(line => {
          const idx = line.indexOf(':');
          if (idx > 0) headers.set(line.slice(0, idx).trim(), line.slice(idx + 1).trim());
        });
      resolve(
        new Response(xhr.responseText, {
          status: xhr.status,
          statusText: xhr.statusText,
          headers,
        }),
      );
    };

    xhr.onerror = () => reject(new TypeError('Network request failed'));
    xhr.ontimeout = () => reject(new TypeError('Network request timed out'));
    xhr.onabort = () => {
      const err = new Error('Aborted');
      err.name = 'AbortError'; // để HttpClient nhận diện đúng như fetch abort
      reject(err);
    };

    if (init.signal) {
      if (init.signal.aborted) {
        xhr.abort();
      } else {
        init.signal.addEventListener('abort', onAbort);
      }
    }

    xhr.send(init.body as unknown as Document);
  });
}
