import base from '../../../site.config';

const config = { ...base };

config.ENVIOS = {
  templates: {
    url: `${config.API_DOMAIN}/api/mail/templates`,
  },
  mails: {
    url: `${config.API_DOMAIN}/api/mail/send`,
  },
  newsletter: {
    url: `${config.API_DOMAIN}/api/mail/newsletter`,
  }
};

export default config;
