import {
  map,
} from 'lodash';

import base from '../../app/duck/config';

const config = { ...base };

config.TIPOS_INMUEBLE = {
  tableList: {
    url: `${config.API_DOMAIN}/api/tipos-inmuebles`,
    i18nKey: 'app.tipos-inmuebles.index',
    limit: config.TABLES.limit,
    columns: {
      defaults: {
        src: (data, key) => data[key],
        type: 'string',
        i18n: data => data.key,
      },
      payload: [
        { key: 'name' },
        { key: 'created_at' },
        { key: 'active', type: 'boolean' },
      ],
    }
  },
};

// assign default config values
config.TIPOS_INMUEBLE.tableList.columns.payload = map(config.TIPOS_INMUEBLE.tableList.columns.payload, which => ({
  ...config.TIPOS_INMUEBLE.tableList.columns.defaults,
  ...which,
}));

export default { ...config, ...base };
