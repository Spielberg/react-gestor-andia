import base from '../../../site.config';

const config = { ...base };

config.I18N = {
  default: 'es',
  langs: ['es'],
};

config.PATHS = {
  homepage: '/',

  // visitas
  visitas_anadir: '/visitas/anadir',
  visitas_editar: '/visitas/:id',
  visitas: '/visitas',

  // ventas
  ventas_anadir: '/ventas/anadir',
  ventas: '/ventas',

  // status
  status_promociones: '/status-promociones',

  configuracion: {
    // usuarios
    usuarios_anadir: '/configuracion/usuarios/anadir',
    usuarios_editar: '/configuracion/usuarios/:id',
    usuarios: '/configuracion/usuarios',

    // promociones
    promociones_anadir: '/configuracion/promociones/anadir',
    promociones_editar: '/configuracion/promociones/:id',
    promociones: '/configuracion/promociones',
    
    tiposInmuebles: '/configuracion/tipos-de-inmuebles',
  }
};

config.REDIRECT = {
  timeout: 3,
};

config.SITE = {
  copyright: 'Construcciones Andia ©',
};

config.DEFAULT = {
  DATE_TIME_FORMAT: 'DD-MM-YYYY HH:mm',
  DATE_FORMAT: 'DD-MM-YYYY',
  TABLE_LIMIT: 10,
};

export default config;