import types from './types';

import Auth from './auth.class';

const sessionMiddleware = store => next => (action) => {
  // prepare profile
  const auth = new Auth();
  switch (action.type) {
    case types.RECEIVE_LOGIN_SUCCESS:
      auth.setToken(action.payload.data.token);
      action.payload = {
        authenticated: true,
        authToken: action.payload.data.token,
        profile: auth.getProfile(),
      };
      next(action);
      break;
    case types.RECEIVE_LOGOUT_SUCCESS:
      auth.logout();
      next(action);
      break;
    default: 
      next(action);
      break;
  }
};

export default sessionMiddleware;
