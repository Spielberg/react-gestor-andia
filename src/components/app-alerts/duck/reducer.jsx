import {
  omit,
} from 'lodash';

import types from './types';

const defaultState = {};

export default (state = defaultState, action) => {
  switch (action.type) {
    case types.APP_ALERTS_ADD:
      return {
        ...state,
        [action.payload.id]: action.payload,
      };
    case types.APP_ALERTS_REMOVE:
      return omit(state, [action.payload.id]);
    case types.APP_ALERTS_REMOVE_ALL:
      return defaultState;
    default:
      return state;
  }
};
