/// <reference types="nativewind/types" />

import 'react-native';

// NativeWind v4 remap props — runtime đã hỗ trợ, bổ sung types
declare module 'react-native' {
  interface ScrollViewProps {
    contentContainerClassName?: string;
  }
  // Generic phải khớp arity với khai báo gốc của RN dù không dùng
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface FlatListProps<ItemT> {
    columnWrapperClassName?: string;
  }
  interface ImageBackgroundProps {
    imageClassName?: string;
  }
}
