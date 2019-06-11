import moment from 'moment';
import {
  map,
} from 'lodash';

import base from '../../visitas/duck/config';

const config = { ...base };

config.VENTAS = {
  tableList: {
    url: `${config.API_DOMAIN}/api/ventas`,
    i18nKey: 'app.ventas.index',
    limit: config.DEFAULT.TABLE_LIMIT,
    addUrl: config.PATHS.ventas_anadir,
    columns: {
      defaults: {
        src: (data, key) => data[key],
        type: 'string',
        i18n: data => data.key,
      },
      payload: [
        { key: 'promocion' },
        { key: 'name', src: (data) => {
          if (data.name !== '' && data.apellido_1 !== '') {
            return `${data.apellido_1}, ${data.name}`;
          } else if (data.name !== '') {
            return data.name;
          }
          return data.apellido_1;
        }},
        { key: 'created_at', src: (data, key) => moment(data.created_at).format(config.DEFAULT.DATE_FORMAT) },
      ],
    }
  },
};

// assign default config values
config.VENTAS.tableList.columns.payload = map(config.VENTAS.tableList.columns.payload, which => ({
  ...config.VENTAS.tableList.columns.defaults,
  ...which,
}));

export default config;
