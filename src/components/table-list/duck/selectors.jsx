import axios from 'axios';
import {
  keyBy,
} from 'lodash';
import config from './config';

const i18nComponentKey = 'app.table-list.index';

function fetch(cb = () => (null)) {
  const url = `${this.props.url}?offset=${this.state.offset}&limit=${this.props.limit}`;
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
        loading: false,
        results: keyBy(response.data.data.results, 'id'),
        pagination: response.data.data.pagination,
      }), () => {
        return cb(null, response.data);
      });
    })
    .catch((error) => {
      return cb(error);
    });
}

function handleOffset(offset) {
  this.setState(current => ({
    ...current,
    loading: true,
    results: {},
    offset,
  }), this.fetch);
}

function handleActive(which, cb = () => null) {
  const url = this.props.url;
  if (config.DEBUG) console.log(url);
  return axios.put(url, { id: which.id, active: !which.active }, {
    headers: {
      Authorization: `Bearer ${this.props.session.authToken}`,
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      console.log({ response });
      if (response.status !== 200 && response.status !== 204) {
        return cb(new Error(`Status erros in fetchStats expected 200 or 204 received ${response.status}`));
      }
      this.setState(current => ({
        ...current,
        results: {
          ...current.results,
          [which.id]: {
            ...current.results[which.id],
            active: !current.results[which.id].active,
          },
        },
      }), () => {
        return cb(null, response.data);
      });
    })
    .catch((error) => {
      return cb(error);
    });
}

function onMount() {
  this.fetch();
}

export default {
  fetch,
  handleActive,
  handleOffset,
  onMount,
};
