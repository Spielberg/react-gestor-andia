import type from './types';

export function setLocale(payload) {
  return {
    type: type.APP_SET_LOCALE,
    payload,
  };
}