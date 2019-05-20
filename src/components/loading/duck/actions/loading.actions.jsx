import TYPES from '../types';

export function displayLoading() {
  return {
    type: TYPES.DISPLAY_LOADING,
  };
}

export function hideLoading() {
  return {
    type: TYPES.HIDE_LOADING,
  };
}
