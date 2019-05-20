import base from '../../../site.config';

const config = { ...base };

config.I18N = {
  default: 'es',
  langs: ['es'],
};

config.PATHS = {
  homepage: '/',
  visitas: '/visitas',
  configuracion: {
    usuarios: '/configuracion/usuarios',
    promociones: '/configuracion/promociones',
    tiposInmuebles: '/configuracion/tipos-de-inmuebles',
  }
};

export default config;