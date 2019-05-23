import config from './config';
import types from './types';

import dictionary from './dictionary';
import loginDiccionary from '../../login/duck/dictionary';
import homeDictionary from '../../home/duck/dictionary';
import promocionesDictionary from '../../promociones/duck/dictionary';
import tableListDictionary from '../../table-list/duck/dictionary';
import usuariosDictionary from '../../usuarios/duck/dictionary';

const defaultState = {
  i18n: {
    locale: config.I18N.default,
    messages: { 
      es: {
        ...dictionary.es,
        ...loginDiccionary.es,
        ...homeDictionary.es,
        ...promocionesDictionary.es,
        ...tableListDictionary.es,
        ...usuariosDictionary.es,
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
