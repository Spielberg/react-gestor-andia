import axios from 'axios';

import config from './config';

const i18nComponentKey = 'app.login.index';

function handleChange(e, which) {
  const value = e.target.value;
  this.setState(current => ({
    ...current,
    values: {
      ...current.values,
      [which]: value,
    },
    errors: {
      ...current.errors,
      [which]: config.LOGIN.defaults.errors[which],
    },
  }));
}

function onSubmit(e , cb = () => (null)) {
  e.preventDefault();
  this.validate(valid => {
    if (!valid) {
      return;
    }
    this.props.fetchLogin(this.state.values, (err) => {
      if (err) {
        this.setState(current => ({
          ...current,
          alert: {
            ...current.alert,
            display: true,
            message: err.message,
          },
        }));
      }
    });
  });
}

function validate(cb = () => (null)) {
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
  handleChange,
  onSubmit,
  validate,
};
