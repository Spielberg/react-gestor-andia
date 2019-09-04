import axios from 'axios';
import moment from 'moment';
import {
  each,
  chain,
  first,
  remove,
  template,
  isEmpty,
} from 'lodash';

import base from './config';

import ventas from '../../ventas/duck/config';

const config = { ...base, ...ventas };

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

function fetchVisita(id, cb = () => (null)) {
  const url = `${config.VISITAS.tableList.url}/${id}`;
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
      const values = response.data.data;
      this.setState(current => ({
        ...current,
        values: {
          ...current.values,
          name: values.name,
          apellido_1: values.apellido_1,
          apellido_2: values.apellido_2,
          email: values.email,
          telefono: values.telefono,
          promociones_id_1: values.promociones_id_1,
          promociones_id_2: values.promociones_id_2,
          tipos_inmuebles_1: values.tipos_inmuebles_1,
          tipos_inmuebles_2: values.tipos_inmuebles_2,
          observaciones: values.observaciones,
          fecha_visita: values.fecha_visita,
          conociste: values.conociste,
          status: values.status,
          users_id: parseInt(values.users_id, 10),
          contactado: values.contactado,
        },
        venta: {
          ...current.venta,
          data: values.venta,
        },
      }), () => {
        return cb(null, response.data);
      });
      if (values.promociones_id_1) {
        this.fetchTiposInmuebles(values.promociones_id_1);
      }
      if (values.promociones_id_2) {
        this.fetchTiposInmuebles(values.promociones_id_2);
      }
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

function submitVenta(visitas_id, cb = () => (null)) {
  const data = {
      tipos_inmuebles_id: parseInt(this.state.venta.candidate.tipo.id, 10),
      promociones_id: parseInt(this.state.venta.candidate.promocion.id, 10),
      visitas_id: parseInt(visitas_id, 10),
    };
    let url = config.VENTAS.tableList.url;
    if (config.DEBUG) console.log(url, data);
    return axios({
      method: 'post', url, data, headers: {
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
        cb(null);
      })
      .catch((error) => {
        return cb(error);
      });
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
        const postSubmit = () => {
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
        };
        if (data.status === 'compra' && isEmpty(this.state.venta.data)) {
          return this.submitVenta(response.data.data.id, (err) => {
            if (!err) {
              postSubmit();    
            }
          });
        }
        postSubmit();
      })
      .catch((error) => {
        return cb(error);
      });
  });
}

function handlePromocion(e, which) {
  const id = e.target.value;
  this.fetchTiposInmuebles(id);
  this.setValue(which, id);
  this.setValue(which === 'promociones_id_1' ? 'tipos_inmuebles_1' : 'tipos_inmuebles_2', []);
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
  const { values, venta } = this.state;
  const current = {
    ...this.state,
    errors: {
      apellido_1: '',
      email: '',
      telefono: '',
      promociones_id_1: '',
      fecha_visita: '',
    },
  };
  let valid = true;
  if (values.apellido_1 === '') {
    current.errors.apellido_1 = this.props.intl.formatMessage({ id: `${i18nComponentKey}.err.apellido_1`, defaultMessage: `${i18nComponentKey}.err.apellido_1` });
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
  if (values.promociones_id_1 === '' || values.tipos_inmuebles_1.length === 0) {
    current.errors.promociones_id_1 = this.props.intl.formatMessage({ id: `${i18nComponentKey}.err.promociones_id`, defaultMessage: `${i18nComponentKey}.err.promociones_id` });
    valid = false;
  }
  if (values.fecha_visita === '') {
    current.errors.fecha_visita = this.props.intl.formatMessage({ id: `${i18nComponentKey}.err.fecha_visita`, defaultMessage: `${i18nComponentKey}.err.fecha_visita` });
    valid = false;
  }
  if (values.status === 'compra' && isEmpty(venta.candidate.promocion) && valid &&  isEmpty(venta.data)) {
    current.venta.modal.display = true;
    valid = false;
  }

  this.setState(current, () => {
    return valid
      ? cb()
      : null;
  });
}

function hideModalVentas(cb = () => null) {
  this.setState(current => ({
    ...current,
    venta: {
      ...current.venta,
      modal: {
        ...current.venta.modal,
        display: false,
      },
    },
  }), cb);  
}

function showModalVentas() {
  this.setState(current => ({
    ...current,
    venta: {
      ...current.venta,
      modal: {
        ...current.venta.modal,
        display: true,
      },
    },
  }));  
}

function selectVenta(candidate) {
  this.setState(current => ({
    ...current,
    venta: {
      ...current.venta,
      candidate,
    },
  }));  
}

function candidatosVenta() {
  const { promociones } = this.state;
  const arr = [];
  if (isEmpty(promociones)) {
    return [];
  }

  each([1,2], n => {
    const promocion = promociones[this.state.values[`promociones_id_${n}`]];
    each (this.state.values[`tipos_inmuebles_${n}`], tipo => {
      arr.push({
        promocion,
        tipo: {
          id: tipo,
          name: config.VISITAS.tiposInmuebles.cases[tipo] || `please updated configuration file for ${tipo}`,
          },
        });
    });
  });
  return arr;
}

function handleDeleteVenta(e, id){
  e.preventDefault();
  const url = `${config.VENTAS.tableList.url}/${id}`;
  if (config.DEBUG) console.log(url);
  return axios.delete(url, {
    headers: {
      Authorization: `Bearer ${this.props.session.authToken}`,
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      this.setState(current => ({
        ...current,
        venta: {
          ...current.venta,
          data: {},
        },
      }));
    })
    .catch((error) => {
      console.error(error);
    });
}

export default {
  candidatosVenta,
  catchReturn,
  didMout,
  displayAlert,
  displayError,
  displaySuccess,
  fetchPromociones,
  fetchTiposInmuebles,
  fetchVisita,
  handleDeleteVenta,
  handleInmuebles,
  handlePromocion,
  handleValues,
  hideModalVentas,
  selectVenta,
  setValue,
  showModalVentas,
  submit,
  submitVenta,
  validate,
};
