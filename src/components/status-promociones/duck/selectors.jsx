import axios from 'axios';
import {
  chain,
  keyBy,
} from 'lodash';
import moment from 'moment';
import config from './config';

moment().locale('es');


const i18nComponentKey = 'app.status-promociones.form';

function didMount() {
  this.fetchData((err) => {
    if (err) {
      if (config.DEBUG) console.error(err);
      this.displayError(err.message);
      this.setState({ loading: false });
      return;
    }
    this.fetchScreenshot(err => {
      if (err) {
        if (config.DEBUG) console.error(err);
        this.displayError(err.message);
        return;
      }
      this.setState({ loading: false });
    });
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

function hideAlert() {
  this.setState(current => ({
    ...current,
    alert: {
      ...current.alert,
      display: false,
    }
  }));
}

function displayError (message) {
  return this.displayAlert(message, 'danger');
}

function displaySuccess (message) {
  this.displayAlert(message, 'success');
  setTimeout(() => {
    this.hideAlert();
  }, 5000);
}

function fetchData(cb = () => (null)) {
  const url = config.STATUS.url;
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
      const data = {
          ...response.data.data,          
          promociones: keyBy(response.data.data.promociones, 'id'),
          tipos_inmuebles: keyBy(response.data.data.tipos_inmuebles, 'id'),
          reservas_by_month: keyBy(response.data.data.reservas_by_month, 'promocion_id'),
          ventas_by_month: keyBy(response.data.data.ventas_by_month, 'promocion_id'),
      };
      this.setState(current => ({
        ...current,
        data,
        screenshots: {
          ...current.screenshots,
          0: { status: data, visible: false },
        },
        }), () => {
        return cb(null, response.data.data);
      });
    })
    .catch((error) => {
      return cb(error);
    });
}

function fetchScreenshot(cb = () => (null)) {
  const url = config.SCEENSHOTS.url;
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
        screenshots: {
          ...current.screenshots,          
          ...chain(response.data.data)
            .map(screenshot => ({
              ...screenshot,
              label: `${screenshot.name} - ${moment(screenshot.created_at).format('D de MMMM YYYY HH:mm')}`,
              visible: true,
              status: {
                ...screenshot.status,          
                promociones: keyBy(screenshot.status.promociones, 'id'),
                tipos_inmuebles: keyBy(screenshot.status.tipos_inmuebles, 'id'),
                reservas_by_month: keyBy(screenshot.status.reservas_by_month, 'promocion_id'),
                ventas_by_month: keyBy(screenshot.status.ventas_by_month, 'promocion_id'),
              },
            }))
            .keyBy('id')
            .value(),
          },
        }), () => {
        return cb(null, response.data.data);
      });
    })
    .catch((error) => {
      return cb(error);
    });
}

function handleScreenshot({ target: { value: screenshot } }){
  const which = screenshot || 0;
  this.setState(current => ({
    ...current,
    screenshot,
    data: {
      ...current.screenshots[which].status,
    },
  }));
}

export default {
  didMount,
  displayAlert,
  displayError,
  displaySuccess,
  fetchData,
  fetchScreenshot,
  handleScreenshot,
  hideAlert,
};
