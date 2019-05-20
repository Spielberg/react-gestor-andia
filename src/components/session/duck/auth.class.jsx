import jwt_decode from 'jwt-decode';

import config from './config';

class Auth {
  constructor() {
    this.getProfile = this.getProfile.bind(this);
  }

  loggedIn() {
    // Checks if there is a saved token and it's still valid
    const token = this.getToken(); // GEtting token from localstorage
    return !!token && !this.isTokenExpired(token); // handwaiving here
  }

  isTokenExpired(token) {
    try {
      const decoded = jwt_decode(token);
      if (decoded.exp > Date.now() / 1000) { // Checking if token is expired. N
        return false;
      }
      return true;
    }
    catch (err) {
      return true;
    }
  }

  setToken(authToken) {
    // Saves user token to localStorage
    localStorage.setItem(config.TOKEN_NAME, authToken);
  }

  getToken() {
    // Retrieves the user token from localStorage
    return localStorage.getItem(config.TOKEN_NAME);
  }

  logout() {
    // Clear user token and profile data from localStorage
    localStorage.removeItem(config.TOKEN_NAME);
  }

  getProfile() {
    // Using jwt-decode npm package to decode the token
    const profile = jwt_decode(this.getToken());
    profile.admin = profile.aud !== undefined && profile.aud === 'admin';
    return profile;
  }
}

export default Auth;
