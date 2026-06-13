// Cấu hình deep link / universal link — đọc từ env để đổi theo môi trường,
// tránh hardcode scheme/host/path rải rác trong App.tsx và các màn onboarding.

/** Scheme của app (vd "everly" → everly://...). */
const SCHEME = process.env.EXPO_PUBLIC_DEEPLINK_SCHEME ?? 'everly';

/** Universal link host, đã gồm scheme http (vd "https://everly.app"). */
const UNIVERSAL_HOST = process.env.EXPO_PUBLIC_UNIVERSAL_LINK_HOST ?? 'https://everly.app';

/** Path nhận lời mời, KHÔNG có dấu "/" đầu (vd "join"). */
export const INVITE_PATH = process.env.EXPO_PUBLIC_INVITE_PATH ?? 'join';

/** Prefixes cho React Navigation linking. */
export const LINKING_PREFIXES = [`${SCHEME}://`, UNIVERSAL_HOST];

/** Route path cho màn PartnerAccept (vd "join/:code"). */
export const INVITE_ROUTE_PATH = `${INVITE_PATH}/:code`;

/** Tạo deep link mời theo scheme app (vd "everly://join/ABC123"). */
export const buildInviteLink = (code: string): string => `${SCHEME}://${INVITE_PATH}/${code}`;
