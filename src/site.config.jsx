const config = {};

config.DEBUG = process.env.DEBUG || true;

config.VERSION = '0.1';

config.PROJECT = 'tweetbinder-dublin';

config.API_DOMAIN = process.env.API_DOMAIN || 'https://www.tweetbinder.com';

config.STATIC_CONTENT_URL = process.env.STATIC_CONTENT_URL || '//s3-eu-west-1.amazonaws.com/office.tweetbinder.com/tut';

config.DEFAULT_USER_PROFILE = process.env.DEFAULT_USER_PROFILE || '//s3-eu-west-1.amazonaws.com/office.tweetbinder.com/3.0/images/logo.svg';

config.TOKEN_NAME = process.env.TOKEN_NAME || `${config.PROJECT}-${config.VERSION.replace(/\./g, '-')}-token`;

config.LOCALSTORAGE = process.env.LOCALSTORAGE || `${config.PROJECT}-${config.VERSION}-warehouse`;

config.PATHS = {};

config.REPORT_ID = process.env.REPORT_ID || '30c34adb';

module.exports = config;