import base from '../../../site.config';

const config = { ...base };

config.API = {
  stats: {
    get: process.env.REACT_APP_API_STATS_GET || `${config.API_DOMAIN}/public-report/data/<%= reportId %>/stats.json`,
  },
};

export default config;
