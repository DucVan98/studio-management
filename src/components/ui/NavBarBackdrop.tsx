import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';
import {
  BlurMask,
  Canvas,
  Circle,
  LinearGradient,
  Oval,
  Path,
  PathOp,
  Shadow,
  Skia,
  vec,
} from '@shopify/react-native-skia';
import { useThemeColors } from '../../tokens/useThemeColors';

/**
 * Backdrop của NavBar vẽ bằng Skia — FILE DUY NHẤT được import
 * @shopify/react-native-skia (luật adapter trong CLAUDE.md).
 *
 * Vẽ toàn bộ phần "hình" của nav bar trong MỘT canvas để shadow liền khối,
 * không tách layer như cách ghép View thường:
 *   1. Pill bar KHOÉT lõm bán nguyệt ở giữa (path boolean: pill − circle)
 *      → shadow đổ theo đúng đường viền khoét.
 *   2. Glow hồng toả quanh FAB (blur thật, không phải nhiều vòng opacity).
 *   3. FAB gradient chéo (Figma: 143°, sáng trên-trái → đậm dưới-phải)
 *      + đổ bóng màu accent + vệt glossy phía trên.
 *
 * Phần tương tác (tab buttons, nút FAB, icon) do NavBar.tsx overlay lên trên.
 */

// ── Hằng số layout (map 1-1 từ Figma frame 161:864, frame cao 122 = 50+64+8) ──
export const BAR_HEIGHT = 64;
export const BAR_MARGIN_X = 16;
export const BAR_RADIUS = 32;
export const FAB_SIZE = 64;
/** Vùng FAB + glow nhô phía trên mép bar */
export const NAV_OVERHANG = 50;
/** Đệm thêm phía trên canvas để blur của glow không bị cắt phẳng (~2σ của blur 20) */
export const GLOW_BLEED = 48;
/** Tâm FAB nằm cao hơn mép trên bar 8px (Figma: bar y=50, FAB center y=42) */
export const FAB_LIFT = 8;
/** Khe hở giữa mép FAB và mép khoét */
const NOTCH_GAP = 8;
const NOTCH_RADIUS = FAB_SIZE / 2 + NOTCH_GAP;

// ── Color utils thuần (không phụ thuộc thư viện) ──────────────────────────────

/** Trộn màu hex với trắng (amount 0→1) — làm sáng */
function lighten(hex: string, amount: number): string {
  return mix(hex, 0xff, amount);
}

/** Trộn màu hex với đen (amount 0→1) — làm tối */
function darken(hex: string, amount: number): string {
  return mix(hex, 0x00, amount);
}

function mix(hex: string, target: number, amount: number): string {
  const n = parseInt(hex.replace('#', ''), 16);
  const ch = (shift: number) => {
    const c = (n >> shift) & 0xff;
    const v = Math.round(c + (target - c) * amount);
    return v.toString(16).padStart(2, '0');
  };
  return `#${ch(16)}${ch(8)}${ch(0)}`;
}

/** Hex → rgba string với alpha */
function withAlpha(hex: string, alpha: number): string {
  const n = parseInt(hex.replace('#', ''), 16);
  return `rgba(${(n >> 16) & 0xff},${(n >> 8) & 0xff},${n & 0xff},${alpha})`;
}

// ── Component ─────────────────────────────────────────────────────────────────

interface NavBarBackdropProps {
  /** Phần canvas kéo dài xuống dưới mép bar (vùng safe-area) để shadow không bị cắt */
  bottomBleed: number;
}

export function NavBarBackdrop({ bottomBleed }: NavBarBackdropProps) {
  const { width } = useWindowDimensions();
  const colors = useThemeColors();

  const accent = colors['--color-accent'];
  const surface = colors['--color-surface'];

  const height = GLOW_BLEED + NAV_OVERHANG + BAR_HEIGHT + bottomBleed;
  const cx = width / 2;
  const barTop = GLOW_BLEED + NAV_OVERHANG;
  const fabCenterY = barTop - FAB_LIFT;
  const fabR = FAB_SIZE / 2;

  // Gradient FAB suy từ token accent để đổi theme vẫn đúng
  // (theme hồng cho ra ~#F2789E → ~#C5396B, khớp Figma)
  const fabGradStart = lighten(accent, 0.22);
  const fabGradEnd = darken(accent, 0.18);

  // Path bar = pill − circle (khoét lõm bán nguyệt quanh FAB)
  const barPath = useMemo(() => {
    const pill = Skia.Path.Make();
    pill.addRRect(
      Skia.RRectXY(
        Skia.XYWHRect(BAR_MARGIN_X, barTop, width - BAR_MARGIN_X * 2, BAR_HEIGHT),
        BAR_RADIUS,
        BAR_RADIUS,
      ),
    );
    const hole = Skia.Path.Make();
    hole.addCircle(cx, fabCenterY, NOTCH_RADIUS);
    // op() mutate pill tại chỗ (trả về boolean thành công/thất bại)
    pill.op(hole, PathOp.Difference);
    return pill;
  }, [width, cx, fabCenterY, barTop]);

  return (
    <Canvas pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, width, height }}>
      {/* 1. Bar khoét + shadow mềm liền theo đường viền (kể cả phần lõm) */}
      <Path path={barPath} color={surface}>
        <Shadow dx={0} dy={10} blur={11} color={withAlpha(darken(accent, 0.3), 0.14)} />
        <Shadow dx={0} dy={2} blur={3} color="rgba(0,0,0,0.04)" />
      </Path>

      {/* 2. Glow toả quanh FAB (Figma: ellipse 96 + layer blur) */}
      <Circle cx={cx} cy={fabCenterY} r={46} color={accent} opacity={0.32}>
        <BlurMask blur={20} style="normal" />
      </Circle>

      {/* 3. FAB: gradient chéo 143° + bóng accent (Figma: 0 6 14 rgba(196,56,107,0.45)) */}
      <Circle cx={cx} cy={fabCenterY} r={fabR}>
        <Shadow dx={0} dy={6} blur={7} color={withAlpha(darken(accent, 0.2), 0.45)} />
        <LinearGradient
          start={vec(cx - fabR, fabCenterY - fabR)}
          end={vec(cx + fabR, fabCenterY + fabR)}
          colors={[fabGradStart, fabGradEnd]}
          positions={[0, 0.71]}
        />
      </Circle>

      {/* Vệt glossy elip phía trên FAB (Figma: 46×28 tại offset 9,6) */}
      <Oval x={cx - fabR + 9} y={fabCenterY - fabR + 6} width={46} height={28}>
        <LinearGradient
          start={vec(cx, fabCenterY - fabR + 6)}
          end={vec(cx, fabCenterY - fabR + 34)}
          colors={['rgba(255,255,255,0.5)', 'rgba(255,255,255,0)']}
        />
      </Oval>
    </Canvas>
  );
}
