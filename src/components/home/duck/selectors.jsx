import axios from 'axios';

import config from './config';

const i18nComponentKey = 'app.home.index';

function didMount(){
  this.fetchHomeStats();
} 

function fetchHomeStats(cb = () => (null)) {
  const url = config.HOME.stats.url;
  if (config.DEBUG) console.log(url);
  return axios.get(url, {
    headers: {
      Authorization: `Bearer ${this.props.session.authToken}`,
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      if (response.status !== 200 && response.status !== 204) {
        return cb(new Error(`Status erros in fetchStats expected 200 or 204 received ${response.status}`));
      }
      this.setState(current => ({
        ...current,
        stats: response.data.data,
      }), () => {
        return cb(null, response.data.data);
      });
    })
    .catch((error) => {
      return cb(error);
    });
}



export default {
  didMount,
  fetchHomeStats,
};
