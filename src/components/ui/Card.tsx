import { View } from 'react-native';
import type { ViewProps } from 'react-native';

type Elevation = 'flat' | 'sm' | 'md' | 'lg';

interface CardProps extends ViewProps {
  elevation?: Elevation;
  children: React.ReactNode;
}

const ELEVATION_STYLES: Record<Elevation, string> = {
  flat: '',
  sm:   'shadow-sm',
  md:   'shadow-md',
  lg:   'shadow-lg',
};

/**
 * Card component – surface container với shadow.
 * Map từ Figma card components.
 *
 * @example
 * <Card elevation="md" className="p-5">
 *   <Text>Content</Text>
 * </Card>
 */
export function Card({
  elevation = 'sm',
  children,
  className = '',
  ...rest
}: CardProps) {
  return (
    <View
      className={`bg-surface rounded-2xl ${ELEVATION_STYLES[elevation]} ${className}`}
      {...rest}
    >
      {children}
    </View>
  );
}
