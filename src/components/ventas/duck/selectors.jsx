import axios from 'axios';
import moment from 'moment';
import {
  chain,
  first,
  remove,
  template,
} from 'lodash';

import config from './config';

const i18nComponentKey = 'app.ventas.form';

function catchReturn({ key }){
  if (key === 'Enter') {
    const url = `${config.VISITAS.tableList.url}?query=${this.state.values.visita.apellidos}`;
    if (config.DEBUG) console.log(url);
    return axios.get(url, {
      headers: {
        Authorization: `Bearer ${this.props.session.authToken}`,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (response.data.data.results.length > 0) {
          this.setState(current => ({
            ...current,
            modal: {
              ...current.modal,
              display: true,
              candidates: response.data.data.results,
            },
          }));
        }        
      })
      .catch((error) => {
        this.setState({ search: true });
      });
  }
}

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
  this.setState({ loading: true });
  this.fetchPromociones(() => {
    this.setState({ loading: false });
  });
}

function fetchPromociones(cb = () => (null)) {
  const url = `${config.PROMOCIONES.tableList.url}?limit=100`;
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

function fetchTiposInmuebles(id, cb = () => (null)) {
  const url = template(config.VISITAS.tiposInmuebles.url)({ id });
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
        promociones: {
          ...current.promociones,
          [id]: {
            ...current.promociones[id],
            inmuebles: response.data.data.inmuebles || [],
          },
        }
      }), () => {
        return cb(null, response.data.data);
      });
    })
    .catch((error) => {
      return cb(error);
    });
}

function handleInmuebles(id, which) {
  let arr = this.state.values[which];
  if (arr.indexOf(id) === -1) {
    arr.push(id);
  } else {
    arr = remove(arr, id);
  }
  this.setValue(which, arr);
}

function displayError(message) {
  return this.displayAlert(message, 'danger');
}

function displaySuccess(message) {
  return this.displayAlert(message, 'success');
}

function submit(e, cb = () => (null)) {
  e.preventDefault();
  this.validate(() => {
    console.log(this.state.values);
    const data = {
      tipos_inmuebles_id: parseInt(this.state.values.tipos_inmuebles_id, 10),
      promociones_id: parseInt(this.state.values.promocion_id, 10),
      visitas_id: parseInt(this.state.values.visita.id, 10),
    };
    let url = config.VENTAS.tableList.url;
    if (config.DEBUG) console.log(url, data);
    return axios({
      method: this.state.values.id ? 'put' : 'post', url, data, headers: {
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
        this.displaySuccess(this.props.intl.formatMessage({ id: `${i18nComponentKey}.submit.success`, defaultMessage: `${i18nComponentKey}.submit.success` }, { timeout: this.state.redirect.timeout }));
        window.scrollTo(0,0);
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

function handlePromocion(e) {
  const id = e.target.value;
  this.fetchTiposInmuebles(id);
  this.setValue('promocion_id', id);
  this.setValue('tipos_inmuebles', []);
}

function handleVisita(e, cb = () => null) {
  const apellidos = e.target.value;

  this.setState(current => ({
    ...current,
    values: {
      ...current.values,
      visita: {
        ...current.values.visita,
        apellidos,
      },
    },
  }), cb);
}

function handleValues(e, which, cb = () => null) {
  const value = e.target.value;
  this.setValue(which, value, cb);
}

function setValue(which, value, cb = () => null) {
  this.setState(current => ({
    ...current,
    values: {
      ...current.values,
      [which]: value,
    }
  }), cb);
}

function validate(cb = () => (null)) {
  const { values } = this.state;
  const current = {
    ...this.state,
    errors: {
      tipos_inmuebles_id: '',
      visita: '',
    },
  };
  let valid = true;
  if (values.visita.id === null) {
    current.errors.visita = this.props.intl.formatMessage({ id: `${i18nComponentKey}.err.visita`, defaultMessage: `${i18nComponentKey}.err.visita` });
    valid = false;
  }
  if (values.tipos_inmuebles_id === '') {
    current.errors.tipos_inmuebles_id = this.props.intl.formatMessage({ id: `${i18nComponentKey}.err.tipos_inmuebles_id`, defaultMessage: `${i18nComponentKey}.err.tipos_inmuebles_id` });
    valid = false;
  }

  this.setState(current, () => {
    return valid
      ? cb()
      : null;
  });
}

function hideModal(e, cb = () => (null)) {
  e.preventDefault();
  this.setState(current => ({
    ...current,
    modal: {
      ...current.modal,
      display: false,
    }
  }), cb);
}


export default {
  catchReturn,
  didMout,
  displayAlert,
  displayError,
  displaySuccess,
  fetchPromociones,
  fetchTiposInmuebles,
  handleInmuebles,
  handlePromocion,
  handleValues,
  handleVisita,
  hideModal,
  setValue,
  submit,
  validate,
};
