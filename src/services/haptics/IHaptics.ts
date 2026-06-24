/**
 * Adapter haptics (rung phản hồi) — interface theo nhu cầu của app, KHÔNG
 * sao chép API của thư viện. UI/animation chỉ phụ thuộc interface này, nhờ vậy
 * khi đổi thư viện (expo-haptics → khác) chỉ cần sửa file impl.
 *
 * Mọi method fire-and-forget (trả void) và KHÔNG bao giờ ném lỗi ra ngoài —
 * haptics là hiệu ứng phụ, lỗi của nó không được làm vỡ luồng UI.
 */
export type ImpactStrength = 'light' | 'medium' | 'heavy';
export type NotifyType = 'success' | 'warning' | 'error';

export interface IHaptics {
  /** Tick nhẹ khi chọn: đổi tab, bật/tắt công tắc, chọn ngày. */
  selection(): void;
  /** Va chạm vật lý: nhấn nút, thả tim (mặc định medium). */
  impact(strength?: ImpactStrength): void;
  /** Thông báo kết quả: kết nối thành công, mở khoá, lỗi form. */
  notify(type: NotifyType): void;
}
