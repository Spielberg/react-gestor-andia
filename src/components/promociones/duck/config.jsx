import {
  map,
} from 'lodash';

import base from '../../app/duck/config';

const config = { ...base };

config.PROMOCIONES = {
  tableList: {
    url: `${config.API_DOMAIN}/api/promociones`,
    i18nKey: 'app.promociones.index',
    limit: config.TABLES.limit,
    columns: {
      defaults: {
        src: (data, key) => data[key],
        type: 'string',
        i18n: data => data.key,
      },
      payload: [
        { key: 'id' },
        { key: 'name' },
        { key: 'zona' },
        { key: 'active', type: 'boolean' },
      ],
    }
  },
};

// assign default config values
config.PROMOCIONES.tableList.columns.payload = map(config.PROMOCIONES.tableList.columns.payload, which => ({
  ...config.PROMOCIONES.tableList.columns.defaults,
  ...which,
}));

export default { ...config, ...base };
