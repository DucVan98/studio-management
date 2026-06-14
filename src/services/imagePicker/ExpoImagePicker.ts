import * as ImagePicker from 'expo-image-picker';
import type { IImagePicker, PickImageOptions } from './IImagePicker';
import type { MediaUpload } from '../../domain/entities';
import { AppError } from '../../domain/errors/AppError';

/**
 * Hiện thực IImagePicker bằng expo-image-picker.
 * Đây là FILE DUY NHẤT được import expo-image-picker.
 */
export class ExpoImagePicker implements IImagePicker {
  async pickFromLibrary(options?: PickImageOptions): Promise<MediaUpload | null> {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      throw new AppError('Cần quyền truy cập thư viện ảnh', 'forbidden');
    }
    const result = await ImagePicker.launchImageLibraryAsync(this.toLibOptions(options));
    return this.toMediaUpload(result);
  }

  async takePhoto(options?: PickImageOptions): Promise<MediaUpload | null> {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      throw new AppError('Cần quyền truy cập camera', 'forbidden');
    }
    const result = await ImagePicker.launchCameraAsync(this.toLibOptions(options));
    return this.toMediaUpload(result);
  }

  /** Map options app → options expo-image-picker. */
  private toLibOptions(options?: PickImageOptions): ImagePicker.ImagePickerOptions {
    return {
      mediaTypes: ['images'],
      allowsEditing: options?.allowsEditing ?? false,
      aspect: options?.aspect,
      quality: options?.quality ?? 0.8,
    };
  }

  /** Map kết quả expo → MediaUpload; null nếu huỷ. */
  private toMediaUpload(result: ImagePicker.ImagePickerResult): MediaUpload | null {
    if (result.canceled || result.assets.length === 0) {
      return null;
    }
    const asset = result.assets[0];
    const mimeType = asset.mimeType ?? this.inferMimeType(asset.uri);
    const name = asset.fileName ?? this.fileNameFromUri(asset.uri, mimeType);
    return { uri: asset.uri, name, mimeType };
  }

  /** Suy MIME từ đuôi file khi expo không trả về. */
  private inferMimeType(uri: string): string {
    const ext = uri.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'png':
        return 'image/png';
      case 'gif':
        return 'image/gif';
      case 'webp':
        return 'image/webp';
      case 'heic':
        return 'image/heic';
      default:
        return 'image/jpeg';
    }
  }

  /** Sinh tên file từ uri (hoặc tên mặc định theo MIME). */
  private fileNameFromUri(uri: string, mimeType: string): string {
    const last = uri.split('/').pop();
    if (last && last.includes('.')) return last;
    const ext = mimeType.split('/').pop() ?? 'jpg';
    return `image.${ext}`;
  }
}
