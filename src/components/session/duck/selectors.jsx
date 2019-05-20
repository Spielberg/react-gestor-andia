import jwt_decode from 'jwt-decode';

import config from './config';

import Auth from './auth.class';

const i18nComponentKey = 'app.session';

/**
 * Everytime you load the app.
 * @returns {none}.
 */
function componentDidMount(cb = () => null) {
  // checkUrlParams
  const urlParams = new URLSearchParams(window.location.search);
  const authToken = urlParams.get('authToken');
  const auth = new Auth();

  // firts case the new tocken is in the URL
  if (authToken !== null) {
    const { origin, pathname, hash } = window.location;
    const redirect = `${origin}${pathname !== '/' ? `${pathname}/` : pathname}${hash}`;
    auth.setToken(authToken);
    return window.location = redirect;
  }
  return cb();
}

/**
 * logout helper.
 * @returns {none}.
 */
function logout(reload = false) {
  const auth = new Auth();
  auth.logout();
  if (reload) {
    window.location.reload();
  }
}

/**
 * decode token helper.
 * Using jwt-decode npm package to decode the token
 * @returns {obj} profile.
 */
function decodeToken(token) {
  return jwt_decode(token);
}

export default {
  componentDidMount,
  decodeToken,
  logout,
};
