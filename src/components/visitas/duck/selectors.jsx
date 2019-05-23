import axios from 'axios';
import moment from 'moment';
import {
  first,
} from 'lodash';

import config from './config';

const i18nComponentKey = 'app.visitas.form';

function catchReturn({ key }){
  if (key === 'Enter') {
    const url = `${config.VISITAS.tableList.url}?telefono=${this.state.values.telefono}&limit=1`;
    if (config.DEBUG) console.log(url);
    return axios.get(url, {
      headers: {
        Authorization: `Bearer ${this.props.session.authToken}`,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        let current = {
          ...this.state,
          search: true,
        };
        if (response.data.data.results.length > 0) {
          const candidate = first(response.data.data.results);
          current = {
            ...current,
            values: {
              ...current.values,
              name: candidate.name,
              email: candidate.email,
              telefono: candidate.telefono,
            },
          };
        }
        this.setState({ ...current });
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
  const { id } = this.state.values;
  if (id) {
    this.setState({ loading: true });
    this.fetchVisita(id, () => {
      this.setState({ loading: false });
    });
  }
  this.fetchPromociones();
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
        promociones: response.data.data.results,
      }), () => {
        return cb(null, response.data.data);
      });
    })
    .catch((error) => {
      return cb(error);
    });
}

function fetchVisita(id, cb = () => (null)) {
  const url = `${config.VISITAS.tableList.url}?id=${id}`;
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
      const values = first(response.data.data.results);
      this.setState(current => ({
        ...current,
        values: {
          ...current.values,
          name: values.name,
          email: values.email,
          telefono: values.telefono,
          promociones_id: values.promociones_id,
          observaciones: values.observaciones,
          fecha_visita: values.fecha_visita,
          conociste: values.conociste,
          status: values.status,
          users_id: parseInt(values.users_id, 10),
        },
      }), () => {
        return cb(null, response.data);
      });
    })
    .catch((error) => {
      return cb(error);
    });
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
    const data = {
      ...this.state.values,
      fecha_visita: moment(this.state.values.fecha_visita).format('YYYY-MM-DD'),
    };
    let url = config.VISITAS.tableList.url;
    if (config.DEBUG) console.log(url);
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
    }
  }));
}

function handleFechaVisita(fecha_visita) {
  this.setState(current => ({
    ...current,
    values: {
      ...current.values,
      fecha_visita,
    }
  }));
}

function validate(cb = () => (null)) {
  const { values } = this.state;
  const current = {
    ...this.state,
    errors: {
      name: '',
      email: '',
      telefono: '',
      promociones_id: '',
      fecha_visita: '',
    },
  };
  let valid = true;
  if (values.name === '') {
    current.errors.name = this.props.intl.formatMessage({ id: `${i18nComponentKey}.err.name`, defaultMessage: `${i18nComponentKey}.err.name` });
    valid = false;
  }
  if (
    values.email === ''
    || !/[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}/igm.test(values.email)
  ) {
    current.errors.email = this.props.intl.formatMessage({ id: `${i18nComponentKey}.err.email`, defaultMessage: `${i18nComponentKey}.err.email` });
    valid = false;
  }
  if (values.telefono === '') {
    current.errors.telefono = this.props.intl.formatMessage({ id: `${i18nComponentKey}.err.telefono`, defaultMessage: `${i18nComponentKey}.err.telefono` });
    valid = false;
  }
  if (values.promociones_id === '') {
    current.errors.promociones_id = this.props.intl.formatMessage({ id: `${i18nComponentKey}.err.promociones_id`, defaultMessage: `${i18nComponentKey}.err.promociones_id` });
    valid = false;
  }
  if (values.fecha_visita === '') {
    current.errors.fecha_visita = this.props.intl.formatMessage({ id: `${i18nComponentKey}.err.fecha_visita`, defaultMessage: `${i18nComponentKey}.err.fecha_visita` });
    valid = false;
  }

  this.setState(current, () => {
    return valid
      ? cb()
      : null;
  });
}

export default {
  catchReturn,
  didMout,
  displayAlert,
  displayError,
  displaySuccess,
  fetchPromociones,
  fetchVisita,
  handleFechaVisita,
  handleValues,
  submit,
  validate,
};
