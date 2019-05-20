import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  Alert,
  FormCard,
  FormTextInput,
  StandaloneFormPage,
} from 'tabler-react';
import {
  each,
} from 'lodash';

import {
  fetchLogin,
} from '../session/duck/actions/login.actions';

import {
  loginSelectors,
} from './duck';

const i18nComponentKey = 'app.login.index';
const propTypes = {
  
};
const defaultProps = {};

class Login extends Component {
  /**
  * class constructor
  * @param {obj} props - Component properties
  * @return {void}
  */
  constructor(props) {
    super(props);
    this.state = {
      alert: {
        display: false,
        message: '',
      },
      errors: {
        email: '',
        password: '',
      },
      values: {
        email: 'mail@gmail.com',
        password: '12345678',
      },
    };
    each(loginSelectors, (_, k) => this[k] = loginSelectors[k].bind(this));
  }

  /**
  * component render method
  * @return {reactElement} - react element itself
  */
  render() {
    const { alert, errors, values } = this.state;

    return (
      <Fragment>
        <StandaloneFormPage>
          <FormCard
            buttonText={this.props.intl.formatMessage({ id: `${i18nComponentKey}.btn.submit`, defaultMessage: `${i18nComponentKey}.btn.submit` })}
            title={this.props.intl.formatMessage({ id: `${i18nComponentKey}.title`, defaultMessage: `${i18nComponentKey}.title` })}
            onSubmit={this.onSubmit}
            action={console.log}
            method="post"
          >
            {alert.display && <Alert type="danger" icon="alert-triangle">{alert.message}</Alert>}
            <FormTextInput
              name="email"
              label={this.props.intl.formatMessage({ id: `${i18nComponentKey}.label.email`, defaultMessage: `${i18nComponentKey}.label.email`})}
              placeholder={this.props.intl.formatMessage({ id: `${i18nComponentKey}.placeholder.email`, defaultMessage: `${i18nComponentKey}.placeholder.email`})}
              onChange={e => this.handleChange(e, 'email')}
              value={values && values.email}
              error={errors && errors.email}
            />
            <FormTextInput
              name="password"
              type="password"
              label={this.props.intl.formatMessage({ id: `${i18nComponentKey}.label.password`, defaultMessage: `${i18nComponentKey}.label.password`})}
              onChange={e => this.handleChange(e, 'password')}
              value={values && values.password}
              error={errors && errors.password}
            />
          </FormCard>
        </StandaloneFormPage>
      </Fragment>
    );
  }
}

Login.propTypes = propTypes;
Login.defaultProps = defaultProps;

export default injectIntl(
  connect(
    // mapStateToProps
    state => ({}),
    // mapActionsToProps
    dispatch => bindActionCreators({
      fetchLogin,
    }, dispatch),
  )(Login));
