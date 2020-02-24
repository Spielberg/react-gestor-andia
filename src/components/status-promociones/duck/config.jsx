import base from '../../tipos-inmuebles/duck/config';

const config = { ...base };

config.STATUS = {
  url: `${config.API_DOMAIN}/api/status_promociones`,
  promocion: {
    header: [
      1, 
      2,
      3,
      4,
      8,
      5,
      6, 
      7,   
    ],
  }
};

config.SCEENSHOTS = {
  url: `${config.API_DOMAIN}/api/sceenshots`,
};

export default { ...config, ...base };
