import base from '../../../site.config';

const config = { ...base };

config.HOME = {
  stats: {
    url: `${config.API_DOMAIN}/api/home`,
    since: {
      week: [7, 'days'],
      month: [1, 'months'],
      year: [7, 'year'],
    },
  },
};

config.HOME.defaults = {
  since: 'week',
};

export default config;
