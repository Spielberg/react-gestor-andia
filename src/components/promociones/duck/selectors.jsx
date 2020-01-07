import axios from 'axios';
import {
  first,
  chain,
  isNaN,
  omitBy,
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
  this.fetchZonas();
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
        return cb(null, response.data.data);
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
          historico: {
            reserva: chain(promocion.historico.reserva)
                      .keyBy('id')
                      .mapValues('cantidad')
                      .value(),
            venta: chain(promocion.historico.venta)
                      .keyBy('id')
                      .mapValues('cantidad')
                      .value(),
          },
          inmuebles: chain(promocion.inmuebles)
                      .keyBy('id')
                      .mapValues('cantidad')
                      .value(),
        },
      }), () => {
        return cb(null, response.data);
      });
    })
    .catch((error) => {
      return cb(error);
    });
}

function fetchZonas(cb = () => (null)) {
  const url = config.PROMOCIONES.zonas.url;
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
        zonas: response.data.data,
      }), () => {
        return cb(null, response.data.data);
      });
    })
    .catch((error) => {
      return cb(error);
    });
}

function handleInmuebles (e, which) {
  const value = parseInt(e.target.value, 10);
  this.setState(current => ({
    ...current,
    values: {
      ...current.values,
      inmuebles: {
        ...current.values.inmuebles,
        [which]: value,
      },
    }
  }));
}

function handleHistorico (e, type, which) {
  const value = parseInt(e.target.value, 10);
  this.setState(current => ({
    ...current,
    values: {
      ...current.values,
      historico: {
        ...current.values.historico,
        [type]: {
          ...current.values.historico[type],
          [which]: value,
        },
      },
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
  const body = {
    ...this.state.values,
    inmuebles: omitBy(this.state.values.inmuebles, (val, key) => val === 0 || isNaN(val)),
    historico: {
      reserva: omitBy(this.state.values.historico.reserva, (val, key) => val === 0 || isNaN(val)),
      venta: omitBy(this.state.values.historico.venta, (val, key) => val === 0 || isNaN(val)),
    },
  };
  this.validate(() => {
    let url = config.PROMOCIONES.tableList.url;
    if (config.DEBUG) console.log(url);
    return axios({ method: this.state.values.id ? 'put' : 'post', url, data: body, headers: {
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
              enabled: true,
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

function handleZona(zona) {
  this.setState(current => ({
    ...current,
    values: {
      ...current.values,
      zona,
    }
  }));
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
  fetchZonas,
  handleHistorico,
  handleInmuebles,
  handleValues,
  handleZona,
  submit,
  validate,
};
