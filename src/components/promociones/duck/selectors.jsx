import axios from 'axios';
import {
  first,
  map,
  pull,
} from 'lodash';

import config from './config';

const i18nComponentKey = 'app.promociones.form';

function displayAlert(message, type) {
  this.setState(current => ({
    ...current,
    alert: {
      ...current.alert,
      display: true,
      type,
      message,
    }
  }));
}

function didMout() {
  const { id } = this.state.values;
  if (id) {
    this.setState({ loading: true });
    this.fetchPromocion(id, () => {
      this.setState({ loading: false });
    });
  }
  this.fetchInmuebles();
}

function fetchInmuebles(cb = () => (null)) {
  const url = `${config.TIPOS_INMUEBLE.tableList.url}?limit=100`;
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
        inmuebles: response.data.data.results,
      }), () => {
        return cb(null, response.data);
      });
    })
    .catch((error) => {
      return cb(error);
    });
}

function fetchPromocion(id, cb = () => (null)) {
  const url = `${config.PROMOCIONES.tableList.url}?id=${id}`;
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
      const promocion = first(response.data.data.results);
      this.setState(current => ({
        ...current,
        values: {
          ...current.values,
          name: promocion.name,
          zona: promocion.zona,
          inmuebles: map(promocion.inmuebles, 'id'),
        },
      }), () => {
        return cb(null, response.data);
      });
    })
    .catch((error) => {
      return cb(error);
    });
}

function handleInmuebles (e) {
  const value = parseInt(e.target.value, 10);
  let inmuebles = this.state.values.inmuebles;
  if (inmuebles.indexOf(value) === -1) {
    inmuebles.push(value);
  } else {
    inmuebles = pull(inmuebles, value);
  }
  this.setState(current => ({
    ...current,
    values: {
      ...current.values,
      inmuebles,
    }
  }));
}

function displayError (message) {
  return this.displayAlert(message, 'danger');
}

function displaySuccess (message) {
  return this.displayAlert(message, 'success');
}

function submit(e, cb = () => (null)) {
  e.preventDefault();
  this.validate(() => {
    let url = config.PROMOCIONES.tableList.url;
    if (config.DEBUG) console.log(url);
    return axios({ method: this.state.values.id ? 'put' : 'post', url, data: this.state.values, headers: {
        Authorization: `Bearer ${this.props.session.authToken}`,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (response.status !== 200 && response.status !== 204) {
          return cb(new Error(`Status erros in fetchStats expected 200 or 204 received ${response.status}`));
        }
        if (response.data.error) {
          return this.displayError(response.data.message);
        }
        this.displaySuccess(this.props.intl.formatMessage({ id: `${i18nComponentKey}.submit.success`, defaultMessage: `${i18nComponentKey}.submit.success`}, { timeout: this.state.redirect.timeout}));
        setTimeout(() => {
          this.setState(current => ({
            ...current,
            redirect: {
              ...current.redirect,
              //enabled: true,
            }
          }));
        }, this.state.redirect.timeout * 1000);
      })
      .catch((error) => {
        return cb(error);
      });
  });
}

function handleValues(e, which) {
  const value = e.target.value;
  this.setState(current => ({
    ...current,
    values: {
      ...current.values,
      [which]: value,
    }}));
}

function validate(cb = () => (null)) {
  const { values } = this.state;
  const current = {
    ...this.state,
    errors: {
      name: '',
      zona: '',
    },
  };
  let valid = true;
  if ( values.name === '') {
    current.errors.name = this.props.intl.formatMessage({ id: `${i18nComponentKey}.err.name`, defaultMessage: `${i18nComponentKey}.err.name` });
    valid = false;
  }
  if ( values.zona === '' ) {
    current.errors.zona = this.props.intl.formatMessage({ id: `${i18nComponentKey}.err.zona`, defaultMessage: `${i18nComponentKey}.err.zona` });
    valid = false;
  }
  this.setState(current, () => {
    return valid
      ? cb()
      : null;
    });
}

export default {
  didMout,
  displayAlert,
  displayError,
  displaySuccess,
  fetchInmuebles,
  fetchPromocion,
  handleInmuebles,
  handleValues,
  submit,
  validate,
};
