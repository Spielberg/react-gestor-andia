import axios from 'axios';
import {
  chain,
  each,
  isUndefined,
  isNull,
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
  if (this.props.filterByPromocion && this.state.promocion_id !== '') {
    url += `&promocion=${this.state.promocion_id}`;
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
        results: chain(response.data.data.results)
          .map(row => ({
            ...row,
            selected: false,
          }))
          .keyBy('id')
          .value(),
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

function handleSelect(which) {
  this.setState(current => ({
    ...current,
    results: {
      ...current.results,
      [which.id]: {
        ...current.results[which.id],
        selected: !current.results[which.id].selected,
      }
    },
  }));
}

function handleBoolean(which, key, cb = () => null) {
  const url = this.props.url;
  if (config.DEBUG) console.log(url);
  return axios.put(url, { id: which.id, [key]: !which[key] ? 1 : 0 }, {
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
            [key]: !current.results[which.id][key],
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

function handleActive(which, cb = () => null) {
  return this.handleBoolean(which, 'active', cb);
}

function handleHome(which, cb = () => null) {
  return this.handleBoolean(which, 'home', cb);
}

function hideModal() {
  this.setState(current => ({
    ...current,
    modal: {
      ...current.modal,
      display: false,
      candidate: null,
    }
  }));
}

function showModal(candidate) {
  this.setState(current => ({
    ...current,
    modal: {
      ...current.modal,
      display: true,
      candidate,
    }
  }));
}

function handleDelete(){
  if (isNull(this.state.modal.candidate) || !this.state.modal.candidate.id) {
    return;
  }
  const url = `${this.props.url}/${this.state.modal.candidate.id}`;
  if (config.DEBUG) console.log(url);
  return axios.delete(url, {
    headers: {
      Authorization: `Bearer ${this.props.session.authToken}`,
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      this.fetch(this.hideModal);
    })
    .catch((error) => {
      console.error(error);
    });
}

function handleSuperuser(which, cb = () => null) {
  return this.handleBoolean(which, 'superuser', cb);
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
  if (this.props.filterByPromocion) {
    this.fetchPromociones();
  }
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
  handleBoolean,
  handleDelete,
  handleHome,
  handleOffset,
  handleQuery,
  handleSelect,
  handleSuperuser,
  hideModal,
  onMount,
  showModal,
  urlFor,
};
