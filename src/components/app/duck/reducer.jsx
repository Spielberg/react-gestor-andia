import config from './config';
import types from './types';

import dictionary from './dictionary';
import headerDiccionary from '../../header/duck/dictionary';
import homeDictionary from '../../home/duck/dictionary';
import loginDiccionary from '../../login/duck/dictionary';
import promocionesDictionary from '../../promociones/duck/dictionary';
import tableListDictionary from '../../table-list/duck/dictionary';
import tiposInmueblesDiccionary from '../../tipos-inmuebles/duck/dictionary';
import usuariosDictionary from '../../usuarios/duck/dictionary';
import visitasDiccionary from '../../visitas/duck/dictionary';

const defaultState = {
  i18n: {
    locale: config.I18N.default,
    messages: { 
      es: {
        ...dictionary.es,
        ...headerDiccionary.es,
        ...homeDictionary.es,
        ...loginDiccionary.es,
        ...promocionesDictionary.es,
        ...tableListDictionary.es,
        ...tiposInmueblesDiccionary.es,
        ...usuariosDictionary.es,
        ...visitasDiccionary.es,
      },
    },
  },
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case types.APP_SET_LOCALE:
      if (config.I18N.langs.indexOf(action.payload.locale) === -1) {
        return state;
      }
      return {
        ...state,
        i18n: {
          ...state.i18n,
          loacle: action.payload.locale,
        },
      };
    default:
      return state;
  }
};
