import axios from 'axios';
import {
  keyBy,
} from 'lodash';

import config from './config';

const i18nComponentKey = 'app.status-promociones.form';

function didMount() {
  this.fetchData((err) => {
    this.setState({ loading: false });
    if (err) {
      if (config.DEBUG) console.error(err);
      this.displayError(err.message);
      return;
    }
  });
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

function displayError (message) {
  return this.displayAlert(message, 'danger');
}

function displaySuccess (message) {
  return this.displayAlert(message, 'success');
}

function fetchData(cb = () => (null)) {
  const url = `${config.STATUS.url}?orderBy=${config.STATUS.order.by}&desc=${config.STATUS.order.desc ? 1 : 0}`;
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
        data: {
          ...response.data.data,          
          promociones: keyBy(response.data.data.promociones, 'id'),
          tipos_inmuebles: keyBy(response.data.data.tipos_inmuebles, 'id'),
          reservas_by_month: keyBy(response.data.data.reservas_by_month, 'promocion_id'),
          ventas_by_month: keyBy(response.data.data.ventas_by_month, 'promocion_id'),
          },
        }), () => {
        return cb(null, response.data.data);
      });
    })
    .catch((error) => {
      return cb(error);
    });
}

export default {
  didMount,
  displayAlert,
  displayError,
  displaySuccess,
  fetchData,
};
