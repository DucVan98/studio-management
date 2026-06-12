import { View, Text, TextInput } from 'react-native';
import type { TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
}

/**
 * Input component – map từ Figma input variants.
 *
 * @example
 * <Input label="Email" error="Email không hợp lệ" />
 */
export function Input({ label, error, hint, style, ...rest }: InputProps) {
  return (
    <View className="gap-1.5">
      {label && (
        <Text className="text-body-sm font-medium text-text">
          {label}
        </Text>
      )}
      <TextInput
        // Ép một dòng + cuộn ngang, tránh text dài bị wrap rồi khung h-12 cắt mất.
        multiline={false}
        // text-body-input (không lineHeight) thay vì text-body-md: TextInput +
        // lineHeight trên Fabric bị bug wrap như multiline và lệch căn giữa dọc.
        // py-0 + align-middle để text căn giữa dọc cả Android.
        className={[
          'w-full h-12 px-4 py-0 rounded-xl text-body-input text-text bg-surface align-middle',
          'border',
          error ? 'border-error' : 'border-border',
          'focus:border-accent',
        ].join(' ')}
        placeholderTextColor="#B07A86"
        style={style}
        {...rest}
      />
      {error && (
        <Text className="text-body-sm text-error">{error}</Text>
      )}
      {hint && !error && (
        <Text className="text-body-sm text-text-muted">{hint}</Text>
      )}
    </View>
  );
}
