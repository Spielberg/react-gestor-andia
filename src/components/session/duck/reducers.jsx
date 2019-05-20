import types from './types';

import Auth from './auth.class';

const emptyState = {
  authenticated: false,
  authToken: null,
  profile: {},
};

const auth = new Auth();
const authenticated = auth.loggedIn();
const defaultState = {
  authenticated,
  authToken: authenticated ? auth.getToken() : emptyState.authToken,
  profile: authenticated ? auth.getProfile() : emptyState.profile,
};

export default (state = { ...defaultState }, action) => {
  switch (action.type) {
    case types.REQUEST_LOGIN:
    case types.RECEIVE_LOGOUT_SUCCESS:
    case types.RECEIVE_LOGOUT_ERROR:
    case types.REQUEST_LOGOUT:
      return {
        ...emptyState,
      };
    case types.RECEIVE_LOGIN_SUCCESS:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};
