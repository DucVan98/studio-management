import { View } from 'react-native';
import { Avatar } from './Avatar';
import type { AvatarSize, AvatarColor } from './Avatar';

/**
 * Figma AvatarPair — hai avatar chồng lên nhau (left trước right)
 * Offset = 40% of avatar size
 */

interface AvatarInfo {
  uri?: string | null;
  name?: string;
  color?: AvatarColor;
}

interface AvatarPairProps {
  left: AvatarInfo;
  right: AvatarInfo;
  size?: AvatarSize;
}

const SIZE_DIM: Record<AvatarSize, number> = {
  xs: 28, sm: 36, md: 48, lg: 64, xl: 80,
};

export function AvatarPair({ left, right, size = 'md' }: AvatarPairProps) {
  const dim = SIZE_DIM[size];
  const overlap = Math.round(dim * 0.4);

  return (
    <View style={{ width: dim * 2 - overlap, height: dim }}>
      {/* Right avatar — behind */}
      <View style={{ position: 'absolute', right: 0 }}>
        <Avatar uri={right.uri} name={right.name} size={size} color={right.color ?? 'rose'} className="border-2 border-surface" />
      </View>
      {/* Left avatar — in front */}
      <View style={{ position: 'absolute', left: 0, zIndex: 1 }}>
        <Avatar uri={left.uri} name={left.name} size={size} color={left.color ?? 'accent'} className="border-2 border-surface" />
      </View>
    </View>
  );
}
