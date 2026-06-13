// File này được generate từ feather-icons@4.29.2 (dist/icons.json) — bộ icon line
// trùng với icon set trong Figma. Không sửa tay path; nếu thêm icon mới, copy
// path data từ Feather hoặc export SVG từ Figma (viewBox 24x24, stroke-based).
import { Path, Polyline, Circle, Line, Rect, Polygon } from 'react-native-svg';
import type { ReactElement } from 'react';

import type { IconName } from './Icon';

export const ICON_PATHS: Record<IconName, ReactElement> = {
  'home': (
    <><Path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><Polyline points="9 22 9 12 15 12 15 22" /></>
  ),
  'image': (
    <><Rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><Circle cx="8.5" cy="8.5" r="1.5" /><Polyline points="21 15 16 10 5 21" /></>
  ),
  'award': (
    <><Circle cx="12" cy="8" r="7" /><Polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" /></>
  ),
  'compass': (
    <><Circle cx="12" cy="12" r="10" /><Polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" /></>
  ),
  'user': (
    <><Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><Circle cx="12" cy="7" r="4" /></>
  ),
  'plus': (
    <><Line x1="12" y1="5" x2="12" y2="19" /><Line x1="5" y1="12" x2="19" y2="12" /></>
  ),
  'bell': (
    <><Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><Path d="M13.73 21a2 2 0 0 1-3.46 0" /></>
  ),
  'sliders': (
    <><Line x1="4" y1="21" x2="4" y2="14" /><Line x1="4" y1="10" x2="4" y2="3" /><Line x1="12" y1="21" x2="12" y2="12" /><Line x1="12" y1="8" x2="12" y2="3" /><Line x1="20" y1="21" x2="20" y2="16" /><Line x1="20" y1="12" x2="20" y2="3" /><Line x1="1" y1="14" x2="7" y2="14" /><Line x1="9" y1="8" x2="15" y2="8" /><Line x1="17" y1="16" x2="23" y2="16" /></>
  ),
  'cloud': (
    <><Path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" /></>
  ),
  'heart': (
    <><Path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></>
  ),
  'star': (
    <><Polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></>
  ),
  'gift': (
    <><Polyline points="20 12 20 22 4 22 4 12" /><Rect x="2" y="7" width="20" height="5" /><Line x1="12" y1="22" x2="12" y2="7" /><Path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" /><Path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" /></>
  ),
  'camera': (
    <><Path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><Circle cx="12" cy="13" r="4" /></>
  ),
  'calendar': (
    <><Rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><Line x1="16" y1="2" x2="16" y2="6" /><Line x1="8" y1="2" x2="8" y2="6" /><Line x1="3" y1="10" x2="21" y2="10" /></>
  ),
  'mail': (
    <><Path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><Polyline points="22,6 12,13 2,6" /></>
  ),
  'zap': (
    <><Polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></>
  ),
  'send': (
    <><Line x1="22" y1="2" x2="11" y2="13" /><Polygon points="22 2 15 22 11 13 2 9 22 2" /></>
  ),
  'copy': (
    <><Rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><Path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></>
  ),
  'chevron-right': (
    <><Polyline points="9 18 15 12 9 6" /></>
  ),
  'activity': (
    <><Polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></>
  ),
  'map-pin': (
    <><Path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><Circle cx="12" cy="10" r="3" /></>
  ),
  'sun': (
    <><Circle cx="12" cy="12" r="5" /><Line x1="12" y1="1" x2="12" y2="3" /><Line x1="12" y1="21" x2="12" y2="23" /><Line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><Line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><Line x1="1" y1="12" x2="3" y2="12" /><Line x1="21" y1="12" x2="23" y2="12" /><Line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><Line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></>
  ),
  'edit-2': (
    <><Path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" /></>
  ),
  'lock': (
    <><Rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><Path d="M7 11V7a5 5 0 0 1 10 0v4" /></>
  ),
  'trash-2': (
    <><Polyline points="3 6 5 6 21 6" /><Path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><Line x1="10" y1="11" x2="10" y2="17" /><Line x1="14" y1="11" x2="14" y2="17" /></>
  ),
  'chevron-left': (
    <><Polyline points="15 18 9 12 15 6" /></>
  ),
  'check': (
    <><Polyline points="20 6 9 17 4 12" /></>
  ),
  'x': (
    <><Line x1="18" y1="6" x2="6" y2="18" /><Line x1="6" y1="6" x2="18" y2="18" /></>
  ),
  'settings': (
    <><Circle cx="12" cy="12" r="3" /><Path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></>
  ),
  'search': (
    <><Circle cx="11" cy="11" r="8" /><Line x1="21" y1="21" x2="16.65" y2="16.65" /></>
  ),
  'alert-circle': (
    <><Circle cx="12" cy="12" r="10" /><Line x1="12" y1="8" x2="12" y2="12" /><Line x1="12" y1="16" x2="12.01" y2="16" /></>
  ),
  'alert-triangle': (
    <><Path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><Line x1="12" y1="9" x2="12" y2="13" /><Line x1="12" y1="17" x2="12.01" y2="17" /></>
  ),
  'check-circle': (
    <><Path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><Polyline points="22 4 12 14.01 9 11.01" /></>
  ),
  'info': (
    <><Circle cx="12" cy="12" r="10" /><Line x1="12" y1="16" x2="12" y2="12" /><Line x1="12" y1="8" x2="12.01" y2="8" /></>
  ),
};
