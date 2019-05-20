/* eslint-disable require-jsdoc */
import axios from 'axios';
import _ from 'lodash';

import types from '../types';
import config from '../config';

export function requestLogin(params) {
  return {
    type: types.REQUEST_LOGIN,
    params,
  };
}

export function receiveLoginSuccess(params, data) {
  return {
    type: types.RECEIVE_LOGIN_SUCCESS,
    payload: { params, data },
  };
}

export function receiveLoginError() {
  return {
    type: types.RECEIVE_LOGIN_ERROR,
  };
}

export function fetchLogin(params, cb = () => null) {
  const { email, password } = params;
  return (dispatch) => {
    dispatch(requestLogin(params));
    const url = config.LOGIN.url;
    if (config.DEBUG) console.log('fetchLogin URL', url);
    return axios.post(url, { email, password })
      .then((response) => {
        if (config.DEBUG) console.log(response.status);
        if (response.status !== 200) {
          dispatch(receiveLoginError());
          return cb(new Error(`Status erros in fetchLogin expected 200 received ${response.status}`));
        }
        const { error, message, data } = response.data;
        if (error) {
          dispatch(receiveLoginError());
          return cb(new Error(message));  
        }
        dispatch(receiveLoginSuccess(params, data));
        return cb(null);
      })
      .catch((error) => {
        if (config.DEBUG) console.log('error', error);
        dispatch(receiveLoginError());
        return cb(error);
      });
  };
}

export function requestLogout() {
  return {
    type: types.RECEIVE_LOGOUT_SUCCESS,
  };
}