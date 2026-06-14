import type { MediaUpload } from '../../domain/entities';

/**
 * Tuỳ chọn chọn ảnh — API đặt theo nhu cầu app, KHÔNG sao chép API thư viện.
 */
export interface PickImageOptions {
  /** Cho phép cắt/sửa ảnh trước khi chọn (vd avatar). */
  allowsEditing?: boolean;
  /** Tỉ lệ cắt [w, h] khi allowsEditing — avatar nên [1, 1]. */
  aspect?: [number, number];
  /** Chất lượng nén ảnh 0..1 (mặc định 0.8). */
  quality?: number;
}

/**
 * Cổng chọn ảnh của app. UI/use case chỉ phụ thuộc interface này,
 * không import trực tiếp expo-image-picker.
 * Trả `null` khi người dùng huỷ; ném `AppError` khi thiếu quyền / lỗi.
 */
export interface IImagePicker {
  /** Mở thư viện ảnh thiết bị. */
  pickFromLibrary(options?: PickImageOptions): Promise<MediaUpload | null>;
  /** Mở camera chụp ảnh. */
  takePhoto(options?: PickImageOptions): Promise<MediaUpload | null>;
}
