import base from '../../../site.config';

const config = {};

config.LOGIN = {
  defaults: {
    errors: {
      email: '',
      password: '',
    },  
  },
};

export default { ...config, ...base };
