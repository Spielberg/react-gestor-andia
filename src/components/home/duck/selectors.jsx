import axios from 'axios';
import {
  chain,
  isNull,
  isObject,
  map,
} from 'lodash';

import base from './config';
import promo from '../../promociones/duck/config';

const config = { ...base, ...promo };

function didMount(){
  this.fetchHomeStats();
  this.fetchPromociones();
} 

function fetchPromociones(cb = () => (null)) {
  const url = `${config.PROMOCIONES.tableList.url}?limit=100&home=1`;
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
        promociones: chain(response.data.data.results)
                      .map(promocion => ({
                        ...promocion,
                        inmuebles: [],
                      }))
                      .orderBy('name', 'desc')
                      .keyBy('id')
                      .value(),
      }), () => {
        return cb(null, response.data.data);
      });
    })
    .catch((error) => {
      return cb(error);
    });
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
      this.setState(current => ({
        ...current,
        stats: {
          ...response.data.data,
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
  fetchPromociones,
  handleDates,
  //handleSince,
};
