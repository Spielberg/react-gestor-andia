import axios from 'axios';

import config from './config';

const i18nComponentKey = 'app.promociones.index';

function onMount() {

}

function fetch(cb = () => (null)) {
  const { values } = this.state;
  const current = {
    ...this.state,
    errors: {
      ...config.LOGIN.defaults.errors,
    },
  };
  let valid = true;
  if (
    values.email === ''
    || !/[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}/igm.test(values.email)
  ) {
    current.errors.email = this.props.intl.formatMessage({ id: `${i18nComponentKey}.form.err.email`, defaultMessage: `${i18nComponentKey}.form.err.email` });
    valid = false;
  }
  if ( values.password === '' ) {
    current.errors.password = this.props.intl.formatMessage({ id: `${i18nComponentKey}.form.err.password`, defaultMessage: `${i18nComponentKey}.form.err.password` });
    valid = false;
  }
  this.setState(current, () => cb(valid));
}

export default {
  //handleChange,
};
