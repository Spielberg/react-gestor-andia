const config = {};

config.DEBUG = process.env.REACT_APP_DEBUG || true;

config.COMPANY = 'javier.sanchezostiz@gmail.com';

config.VERSION = '20190626-1';

config.PROJECT = process.env.REACT_APP_PROJECT || 'react-gestor-andia';

//config.API_DOMAIN = process.env.REACT_APP_API_DOMAIN || 'http://localhost:8080';
config.API_DOMAIN = process.env.REACT_APP_API_DOMAIN || 'https://gestor.construccionesandia.com';

config.STATIC_CONTENT_URL = process.env.REACT_APP_STATIC_CONTENT_URL || '//s3.us-east-2.amazonaws.com/artworks-s3/construcciones-andia';

config.DEFAULT_USER_PROFILE = process.env.REACT_APP_DEFAULT_USER_PROFILE || `${config.STATIC_CONTENT_URL}/img/icon.svg`;

config.TOKEN_NAME = process.env.REACT_APP_TOKEN_NAME || `${config.PROJECT}-${config.VERSION.replace(/\./g, '-')}-token`;

config.LOCALSTORAGE = process.env.REACT_APP_LOCALSTORAGE || `${config.PROJECT}-${config.VERSION}-warehouse`;

config.PATHS = {};

config.HASH_ROUTER = process.env.REACT_APP_HASH_ROUTER ?
  process.env.REACT_APP_HASH_ROUTER !== 'false' : true;

if (config.DEBUG) console.log(`${config.PROJECT}: v.${config.VERSION}`);

module.exports = config;
