import base from '../../../site.config';

const config = { ...base };

config.HOME = {
  stats: {
    url: `${config.API_DOMAIN}/api/home`,
  },
};

export default config;
