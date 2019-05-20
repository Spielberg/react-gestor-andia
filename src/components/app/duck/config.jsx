import dictionary from './dictionary';
import base from '../../../site.config';

const config = { ...base };

config.I18N = {
  default: 'en',
  langs: ['en', 'es'],
  dictionary,
};

export default config;