import axios from 'axios';
import {
  each,
  isUndefined,
  isNull,
  keyBy,
} from 'lodash';
import config from './config';

function catchReturn({ key }) {
  if (key === 'Enter') {
    this.fetch();
  }
}

function fetch(cb = () => (null)) {
  let url = `${this.props.url}?offset=${this.state.offset}&limit=${this.props.limit}`;
  if (this.state.query !== '') {
    url += `&query=${this.state.query}`;
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

function handleQuery(e){
  const query = e.target.value;
  this.setState(current => ({
    ...current,
    query,
  }));
}

function onMount() {
  this.fetch();
}

function urlFor(path, params) {
  let to = path;
  const i = to.indexOf(':');
  if (i === -1) {
    return to;
  }

  to = path.substr(0, i - 1);
  each(path.substr(i + 1).split('/:'), (candidate) => {
    const param = candidate.substr(-1) === '?' ?
      { optional: true, value: candidate.substr(0, candidate.length - 1) } :
      { optional: false, value: candidate };
    if (!isUndefined(params[param.value]) && !isNull(params[param.value])) {
      to += `/${params[param.value]}`;
    } else if (!param.optional && config.DEBUG) {
      console.error(`${candidate} is required for ${path}, params: ${JSON.stringify(params)}`);
    }
  });
  return to;
}

export default {
  catchReturn,
  fetch,
  handleActive,
  handleOffset,
  handleQuery,
  onMount,
  urlFor,
};
