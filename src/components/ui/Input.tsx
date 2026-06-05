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
        <Text className="text-body-sm font-medium text-secondary-700">
          {label}
        </Text>
      )}
      <TextInput
        className={[
          'w-full h-12 px-4 rounded-xl text-body-md text-secondary-900 bg-surface',
          'border',
          error ? 'border-error' : 'border-secondary-200',
          'focus:border-primary-400',
        ].join(' ')}
        placeholderTextColor="#94a3b8"
        {...rest}
      />
      {error && (
        <Text className="text-body-sm text-error">{error}</Text>
      )}
      {hint && !error && (
        <Text className="text-body-sm text-secondary-400">{hint}</Text>
      )}
    </View>
  );
}
