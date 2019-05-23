import {
  map,
} from 'lodash';

import base from '../../app/duck/config';

const config = { ...base };

config.USUARIOS = {
  tableList: {
    url: `${config.API_DOMAIN}/api/users`,
    i18nKey: 'app.users.index',
    limit: config.TABLES.limit,
    addUrl: config.PATHS.configuracion.usuarios_anadir,
    editUrl: config.PATHS.configuracion.usuarios_editar,
    columns: {
      defaults: {
        src: (data, key) => data[key],
        type: 'string',
        i18n: data => data.key,
      },
      payload: [
        { key: 'name' },
        { key: 'email' },
        { key: 'created_at', type: 'date' },
        { key: 'last_login', type: 'date' },
        { key: 'active', type: 'boolean' },
        { key: 'superuser', type: 'boolean' },
      ],
    }
  },
};

// assign default config values
config.USUARIOS.tableList.columns.payload = map(config.USUARIOS.tableList.columns.payload, which => ({
  ...config.USUARIOS.tableList.columns.defaults,
  ...which,
}));

export default config;
