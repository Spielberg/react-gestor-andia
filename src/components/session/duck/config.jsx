import base from '../../../site.config';

const config = { ...base };

config.LOGIN = {
  url: `${config.API_DOMAIN}/login`,
}

export default config;
