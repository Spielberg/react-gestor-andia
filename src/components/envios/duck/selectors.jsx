import axios from 'axios';
import {
  keyBy,
  map,
} from 'lodash';

import config from './config';

const i18nComponentKey = 'app.envios.index';

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
function displayError(message) {
  return this.displayAlert(message, 'danger');
}

function displaySuccess(message) {
  return this.displayAlert(message, 'success');
}

function fetchTemplates(cb = () => (null)) {
  const url = config.ENVIOS.templates.url;
  if (config.DEBUG) console.log(url);
  return axios.get(url, {
    headers: {
      Authorization: `Bearer ${this.props.session.authToken}`,
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      if (response.status !== 200 && response.status !== 204) {
        return this.displayError(`Status erros in fetchStats expected 200 or 204 received ${response.status}`);
      }
      this.setState(current => ({
        ...current,
        templates: keyBy(response.data.data, 'id'),
      }), () => {
        return cb(null, response.data.data);
      });
    })
    .catch((error) => {
      return this.displayError(error.message);
    });
}

function handleModal(e, candidates, display, cb = () => (null)) {
  e.preventDefault();
  this.setState(current => ({
    ...current,
    template: '',
    candidates,
    display,
  }), cb);
}

function open(candidates) {
  this.fetchTemplates(() => this.handleModal(new Event('click'), candidates, true));
}

function close(e , cb = () => (null)) {
  this.handleModal(e, [], false, cb);
}

function handleConfirm() {
  const body = {
    to: map(this.state.candidates, 'email'),
    template: this.state.template,
  };
  const url = config.ENVIOS.mails.url;
  if (config.DEBUG) console.log(url);
  return axios.post(url, body, {
    headers: {
      Authorization: `Bearer ${this.props.session.authToken}`,
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      if (response.status !== 200 && response.status !== 204) {
        return this.close(new Event('click'), this.displayError(`Status erros in fetchStats expected 200 or 204 received ${response.status}`));
      }
      return this.close(new Event('click'), this.displaySuccess(response.data.data));
    })
    .catch((error) => {
      return this.close(new Event('click'), this.displayError(error.message));
    });
}

function handleTemplate(e) {
  const template = e.target.value;
  this.setState(current => ({
    ...current,
    template,
  }));
}

export default {
  close,
  displayAlert,
  displayError,
  displaySuccess,
  fetchTemplates,
  handleTemplate,
  handleConfirm,
  handleModal,
  open,
};
