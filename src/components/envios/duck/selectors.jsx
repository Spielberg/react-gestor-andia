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

function handleModal(e, candidates, display, cb = () => (null), newsletter) {
  e.preventDefault();
  this.setState(current => ({
    ...current,
    template: '',
    candidates,
    display,
    newsletter,
    alert: {
      ...current.alert,
      display: false,
    }
  }), cb);
}

function open(candidates, newsletter = false) {
  this.fetchTemplates(() => this.handleModal(new Event('click'), candidates, true, () => null, newsletter));
}

function close(e , cb = () => (null)) {
  this.handleModal(e, [], false, cb, false);
}

function handleSend(url, body) {
  if (config.DEBUG) console.log(url, JSON.stringify(body));
  return axios.post(url, body, {
    headers: {
      Authorization: `Bearer ${this.props.session.authToken}`,
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      if (response.status !== 200 && response.status !== 204) {
        return this.displayError(`Status erros in fetchStats expected 200 or 204 received ${response.status}`);
      }
      return this.displaySuccess(this.props.intl.formatMessage({ id: `${i18nComponentKey}.alert.success`, defaultMessage: `${i18nComponentKey}.alert.success` }));
    })
    .catch((error) => {
      return this.displayError(error.message);
    });
}

function handleConfirm() {
  const body = {
    to: map(this.state.candidates, 'email'),
    template: this.state.template,
  };
  const url = config.ENVIOS.mails.url;
  return this.handleSend(url, body);
}

function handleNewsletter() {
  const body = {
    template: this.state.template,
  };
  const url = config.ENVIOS.newsletter.url;
  return this.handleSend(url, body);
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
  handleConfirm,
  handleSend,
  handleTemplate,
  handleModal,
  handleNewsletter,
  open,
};
