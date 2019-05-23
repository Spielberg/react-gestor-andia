import {
  map,
} from 'lodash';

import base from '../../app/duck/config';

const config = { ...base };

config.VISITAS = {
  tableList: {
    url: `${config.API_DOMAIN}/api/visitas`,
    i18nKey: 'app.visitas.index',
    limit: config.TABLES.limit,
    addUrl: config.PATHS.visitas_anadir,
    editUrl: config.PATHS.visitas_editar,
    columns: {
      defaults: {
        src: (data, key) => data[key],
        type: 'string',
        i18n: data => data.key,
      },
      payload: [
        { key: 'name' },
        { key: 'email' },
        { key: 'telefono' },
        { key: 'comercial' },
        { key: 'promocion' },
        { key: 'fecha_visita' },
      ],
    }
  },
};

// assign default config values
config.VISITAS.tableList.columns.payload = map(config.VISITAS.tableList.columns.payload, which => ({
  ...config.VISITAS.tableList.columns.defaults,
  ...which,
}));

export default { ...config, ...base };
