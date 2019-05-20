/* eslint-disable require-jsdoc */
import axios from 'axios';
import _ from 'lodash';


// mixins
//import { Auth, getClientToken } from './../mixins';

import types from '../types';
import config from '../config';

const i18nComponentKey = 'app.actions.login';

export function requestTwitterAuthorize(params) {
  return {
    type: types.REQUEST_TWITTER_AUTHORIZE,
    params,
  };
}

export function receiveTwitterAuthorizeSuccess(params, data) {
  return {
    type: types.RECEIVE_TWITTER_AUTHORIZE_SUCCESS,
    payload: { params, data },
  };
}

export function receiveTwitterAuthorizeError() {
  return {
    type: types.RECEIVE_TWITTER_AUTHORIZE_ERROR,
  };
}

export function authSetProfile(profile) {
  return {
    type: types.AUTH_USER_SET_PROFILE,
    payload: { profile },
  };
}

export function receiveTokenSuccess(payload) {
  return {
    type: types.RECEIVE_TWITTER_AUTHORIZE_SUCCESS,
    payload,
  };
}
/*
types.RECEIVE_LOGIN_SUCCESS:
      auth.setToken(action.payload.authToken);
      action.payload = {
        authenticated: true,
        authToken: action.payload.authToken,
*/

export function fetchTwitterAuthorize({ customerId = null, redirectURL = window.location.href }, cb = () => null) {
  return (dispatch) => {
    dispatch(requestTwitterAuthorize());
    const arr = [];
    if (!_.isNull(customerId) && customerId !== '') {
      arr.push(`customerId=${customerId}`);
    }
    //const redirectURL = `${config.DOMAIN}/cb.html?cb=${window.location.href.replace('?', '&')}`;
    arr.push(`redirectURL=${encodeURIComponent(redirectURL)}`);
    const url = `${config.API.login.index}?${arr.join('&')}`;
    if (config.DEBUG) console.log('fetchTwitterAuthorize URL', url);
    return axios.get(url)
      .then((response) => {
        if (config.DEBUG) console.log(response.status);
        if (response.status !== 200 || _.isUndefined(response.data.url)) {
          dispatch(receiveTwitterAuthorizeError());
          return cb(new Error(`Status erros in fetchTwitterAuthorize expected 200 received ${response.status}`));
        }
        // redirect user to the twitter
        const location = response.data.url;
        if (config.DEBUG) console.log(location);
        window.location.replace(location);
      })
      .catch((error) => {
        if (config.DEBUG) console.log('error', error);
        dispatch(receiveTwitterAuthorizeError());
        return cb(error);
      });
  };
}

export function receiveFetchLogoutError() {
  return {
    type: types.RECEIVE_FETCH_LOGOUT_ERROR,
  };
}

export function receiveFetchLogoutSuccess() {
  return {
    type: types.RECEIVE_FETCH_LOGOUT_SUCCESS,
  };
}

function unsetProfile () {
  return {
    type: types.AUTH_USER_UNSET_PROFILE,
  };
}

export function authUnsetProfile() {
  return (dispatch) => {
    dispatch(removeAllAlert());
    //const clientToken = getClientToken();
    if (!_.isNull(clientToken)) {
      dispatch(fetchLogout(clientToken, err => {
        if (err && config.DEBUG) console.error(err);
        const auth = new Auth.default();
        auth.logout();
        dispatch(hideLoading());
      }));
    }
    dispatch(unsetProfile());
  };
}

export function fetchLogout(clientToken, cb = () => (null)) {
  return (dispatch) => {
    dispatch(receiveFetchLogoutSuccess());
    cb(null, {});
  };
}

