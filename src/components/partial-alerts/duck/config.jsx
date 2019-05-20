import base from '../../../site.config';

const config = { ...base };

config.PARTIAL_ALERTS = {
  timeout: process.env.PARTIAL_ALERTS_TIMEOUT || 3500,
  include_animations: process.env.PARTIAL_ALERTS_INCLUDE_ANIMATION || false,
  default_style: process.env.PARTIAL_ALERTS_DEFAULT_STYLE || 'bulma',
};

export default config;
