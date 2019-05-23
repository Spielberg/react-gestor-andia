import axios from 'axios';
import {
  first,
  map,
  pull,
} from 'lodash';

import config from './config';

const i18nComponentKey = 'app.users.form';

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
    this.fetchUsuario(id, () => {
      this.setState({ loading: false });
    });
  }
}

function fetchUsuario(id, cb = () => (null)) {
  const url = `${config.USUARIOS.tableList.url}?id=${id}`;
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
    let url = config.USUARIOS.tableList.url;
    if (config.DEBUG) console.log(url);
    const data = {
      id: this.state.values.id,
      name: this.state.values.name,
      email: this.state.values.email,
      password: this.state.values.password,
    }
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
    }
  }));
}

function validate(cb = () => (null)) {
  const { values } = this.state;
  const current = {
    ...this.state,
    errors: {
      email: '',
      name: '',
      password: '',
      rePassword: '',
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
  if (!values.id && values.password === '') {
    current.errors.password = this.props.intl.formatMessage({ id: `${i18nComponentKey}.err.password`, defaultMessage: `${i18nComponentKey}.err.password` });
    valid = false;
  }
  if (!values.id && (values.rePassword === '' || values.password !== values.rePassword)) {
    current.errors.rePassword = this.props.intl.formatMessage({ id: `${i18nComponentKey}.err.rePassword`, defaultMessage: `${i18nComponentKey}.err.rePassword` });
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
  fetchUsuario,
  handleValues,
  submit,
  validate,
};
