import base from '../../../site.config';

const config = { ...base };

config.ENVIOS = {
  templates: {
    url: `${config.API_DOMAIN}/api/mail/templates`,
  },
  mails: {
    url: `${config.API_DOMAIN}/api/mail/send`,
  }
};

export default config;
