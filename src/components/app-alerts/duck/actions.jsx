import type from './types';

export function addAppAlert(payload) {
  return {
    type: type.APP_ALERTS_ADD,
    payload,
  };
}

export function removeAppAlert(id) {
  return {
    type: type.APP_ALERTS_REMOVE,
    payload: { id },
  };
}

export function removeAllAppAlert() {
  return {
    type: type.APP_ALERTS_REMOVE_ALL,
  };
}
