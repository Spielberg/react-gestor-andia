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

config.TABLES = {
  limit: 15, 
};

export default config;