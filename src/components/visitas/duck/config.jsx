import moment from 'moment';
import {
  map,
} from 'lodash';

import base from '../../app/duck/config';
import promociones from '../../promociones/duck/config';

const config = { ...base, ...promociones };

config.VISITAS = {
  tableList: {
    url: `${config.API_DOMAIN}/api/visitas`,
    i18nKey: 'app.visitas.index',
    limit: config.DEFAULT.TABLE_LIMIT,
    addUrl: config.PATHS.visitas_anadir,
    editUrl: config.PATHS.visitas_editar,
    columns: {
      defaults: {
        src: (data, key) => data[key],
        type: 'string',
        i18n: data => data.key,
      },
      payload: [
        { key: 'promocion' },
        { key: 'name' },
        { key: 'email' },
        { key: 'telefono' },
        { key: 'comercial' },
        { key: 'fecha_visita', src: (data, key) => moment(data[key]).format(config.DEFAULT.DATE_FORMAT) },
      ],
    }
  },
  statuses: [
    { key: 'primera' },
    { key: 'reserva' },
    { key: 'anulacion' },
    { key: 'compra' },
  ]
};

// assign default config values
config.VISITAS.tableList.columns.payload = map(config.VISITAS.tableList.columns.payload, which => ({
  ...config.VISITAS.tableList.columns.defaults,
  ...which,
}));

export default { ...config, ...base };
