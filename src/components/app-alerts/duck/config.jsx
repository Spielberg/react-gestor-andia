import base from '../../../site.config';

const config = { ...base };

config.APP_ALERTS = {
  timeout: process.env.ALERTS_TIMEOUT || 8500,
  default_style: process.env.APP_ALERTS_DEFAULT_STYLE || 'bulma',
};

export default config;
