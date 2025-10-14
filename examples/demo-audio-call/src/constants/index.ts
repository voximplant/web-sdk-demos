export const CARD_WIDTH = '360px';

export const CARD_BORDER_RADIUS = '16px';

export const CARD_PADDING = '20px';

export const LONG_PRESS_DURATION_MS = 500;
export const LONG_PRESS_RESET_CHAR_DURATION_MS = LONG_PRESS_DURATION_MS * 3;

export const CALL_DURATION_UPDATE_INTERVAL_MS = 100;

export const STORAGE_KEYS = {
  USERNAME: 'username',
  NODE: 'node',
  CALL_DESTINATION: 'call_destination',
} as const;

export const ROUTE_NAMES = {
  SIGNIN: 'signin',
  MAIN: 'main',
  CALL: 'call',
} as const;
