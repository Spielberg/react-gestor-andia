import axios from 'axios';
import {
  isNull,
  isObject,
  map,
} from 'lodash';

import config from './config';

function didMount(){
  this.fetchHomeStats();
  this.fetchPromociones();
} 

function fetchHomeStats(cb = () => (null)) {
  let url = config.HOME.stats.url;
  const params = [];
  if (!isNull(this.state.since) && isObject(this.state.since)) {
    params.push(`since=${this.state.since.format('YYYY-MM-DD')}`); 
  }
  if (!isNull(this.state.until) && isObject(this.state.until)) {
    params.push(`until=${this.state.until.format('YYYY-MM-DD')}`); 
  }
  if (!isNull(this.state.promocionId) && this.state.promocionId !== '') {
    params.push(`promocionId=${this.state.promocionId}`); 
  }
  url = params.length
    ? `${url}?${params.join('&')}`
    : url;
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
      console.log(response.data.data);
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

function handleDates({ startDate, endDate }) {
  this.setState({ since: startDate, until: endDate }, this.fetchHomeStats);
}

export default {
  didMount,
  fetchHomeStats,
  handleDates,
  //handleSince,
};
