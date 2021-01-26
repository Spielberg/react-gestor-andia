import {
  map,
} from 'lodash';

import base from '../../tipos-inmuebles/duck/config';

const config = { ...base };

config.PROMOCIONES = {
  zonas: {
    url: `${config.API_DOMAIN}/api/promociones/zonas`,
  },
  tableList: {
    url: `${config.API_DOMAIN}/api/promociones`,
    i18nKey: 'app.promociones.index',
    limit: config.DEFAULT.TABLE_LIMIT,
    addUrl: config.PATHS.configuracion.promociones_anadir,
    editUrl: config.PATHS.configuracion.promociones_editar,
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
        { key: 'home', type: 'boolean' },
        { key: 'active', type: 'boolean' },
      ],
    },
    isPromociones: true,
  },
};

// assign default config values
config.PROMOCIONES.tableList.columns.payload = map(config.PROMOCIONES.tableList.columns.payload, which => ({
  ...config.PROMOCIONES.tableList.columns.defaults,
  ...which,
}));

export default { ...config, ...base };
