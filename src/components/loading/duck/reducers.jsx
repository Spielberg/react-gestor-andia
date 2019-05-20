import TYPES from './types';

export default (state = {
  display: false,
}, action) => {
  switch (action.type) {
    case TYPES.HIDE_LOADING:
      return {
        ...state,
        display: false,
      };
    case TYPES.DISPLAY_LOADING:
      return {
        ...state,
        display: true,
      };
    default:
      return state;
  }
};
