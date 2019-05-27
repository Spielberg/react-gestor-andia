import axios from 'axios';
import {
  map,
} from 'lodash';
import moment from 'moment';

import config from './config';

const i18nComponentKey = 'app.home.index';

function didMount(){
  this.fetchHomeStats();
} 

function fetchHomeStats(cb = () => (null)) {
  let url = config.HOME.stats.url;
  if (this.state.since !== '' && config.HOME.stats.since[this.state.since]) {
    const since = moment()
      .subtract(config.HOME.stats.since[this.state.since][0], config.HOME.stats.since[this.state.since][1])
      .format('YYYY-MM-DD');
    url = `${url}?since=${since}`; 
  }
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
        stats: {
          ...response.data.data,
          conociste: map(response.data.data.conociste, arr => ([
            this.props.intl.formatMessage({ id: `app.conociste.${arr[0]}`, defaultMessage: `app.conociste.${arr[0]}`}),
            arr[1],
          ])),
        },
      }), () => {
        return cb(null, response.data.data);
      });
    })
    .catch((error) => {
      return cb(error);
    });
}

function handleSince(e) {
  e.preventDefault();
  const value = e.target.value;
  const { stats: { since } } = config.HOME;
  if (!since[value]) {
    return;
  }
  this.setState(current => ({
    ...current,
    since: value,
  }), this.fetchHomeStats);
}

export default {
  didMount,
  fetchHomeStats,
  handleSince,
};
