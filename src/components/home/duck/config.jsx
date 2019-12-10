import {
  each,
} from 'lodash';
import base from '../../../site.config';

const i18nComponentKey = 'app.home.index';

const config = { ...base };

config.HOME = {
  chart: {
    chartType: 'PieChart',
    width: '100%',
    height: 400,
    options: {
      legend: 'none',
      chartArea: {
        width: '90%',
        height: '70%',
      },
    },
    charts: {
      counts: (data, intl) => {
        const arr = [[
          intl.formatMessage({ id: `${i18nComponentKey}.estatus`, defaultMessage: `${i18nComponentKey}.estatus` }),
          intl.formatMessage({ id: `${i18nComponentKey}.count`, defaultMessage: `${i18nComponentKey}.count` }),
        ]];
        each(data, ([key, value]) => {
          arr.push([key, parseInt(value, 10)]);
        });
        return arr;
      },
      conociste: (data, intl) => {
        const arr = [[
          intl.formatMessage({ id: `${i18nComponentKey}.medio`, defaultMessage: `${i18nComponentKey}.medio` }),
          intl.formatMessage({ id: `${i18nComponentKey}.visita`, defaultMessage: `${i18nComponentKey}.visita` }),
        ]];
        each(data, ([key, value]) => {
          arr.push([key, parseInt(value, 10)]);
        });
        return arr;
      },
      promociones: (data, intl) => {
        const arr = [[
          intl.formatMessage({ id: `${i18nComponentKey}.promocion`, defaultMessage: `${i18nComponentKey}.promocion` }),
          intl.formatMessage({ id: `${i18nComponentKey}.visita`, defaultMessage: `${i18nComponentKey}.visita` }),
        ]];
        each(data, ([key, value]) => {
          arr.push([key, parseInt(value, 10)]);
        });
        return arr;
      },
    }
  },
  stats: {
    url: `${config.API_DOMAIN}/api/home`,
    since: {
      week: [7, 'days'],
      month: [1, 'months'],
      year: [1, 'year'],
    },
  },
};

config.HOME.defaults = {
  since: 'year', // week
};

export default config;
