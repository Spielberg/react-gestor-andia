import moment from 'moment';
import {
  map,
} from 'lodash';

import base from '../../app/duck/config';
import promociones from '../../promociones/duck/config';

const config = { ...base, ...promociones };

config.VISITAS = {
  tiposInmuebles: {
    url: `${config.API_DOMAIN}/api/promociones/<%= id %>`,
  },
  tableList: {
    url: `${config.API_DOMAIN}/api/visitas`,
    i18nKey: 'app.visitas.index',
    limit: config.DEFAULT.TABLE_LIMIT,
    addUrl: config.PATHS.visitas_anadir,
    editUrl: config.PATHS.visitas_editar,
    excelUrl: `${config.API_DOMAIN}/api/excel`,
    columns: {
      defaults: {
        src: (data, key) => data[key],
        type: 'string',
        i18n: data => data.key,
      },
      payload: [
        { key: 'promocion', src: (data) => {
          if (data.promo1 !== '' && data.promo2 !== '' && data.promo2 !== null) {
            return `${data.promo1}, ${data.promo2}`;
          }
          return data.promo1;
        }},
        { key: 'name', src: (data) => {
          if (data.name !== '' && data.apellido_1 !== '') {
            return `${data.apellido_1}, ${data.name}`;
          } else if (data.name !== '') {
            return data.name;
          }
          return data.apellido_1;
        }},
        { key: 'email' },
        { key: 'telefono' },
        { key: 'comercial' },
        { key: 'deleted', type: 'boolean' },
        { key: 'fecha_visita', src: (data, key) => moment(data[key]).format(config.DEFAULT.DATE_FORMAT) },
      ],
    }
  },
  statuses: [
    { key: 'primera' },
    { key: 'reserva' },
    { key: 'anulacion' },
    { key: 'compra' },
  ],
  conociste: [
    'cono',
    'ddnava',
    'ddnavc',
    'ddnot',
    'fotoc',
    'ideal',
    'lista',
    'pisos',
    'valla',
    'web',
  ]
};

// assign default config values
config.VISITAS.tableList.columns.payload = map(config.VISITAS.tableList.columns.payload, which => ({
  ...config.VISITAS.tableList.columns.defaults,
  ...which,
}));

export default { ...config, ...base };
