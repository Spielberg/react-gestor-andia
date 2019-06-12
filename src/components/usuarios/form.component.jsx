import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Redirect } from 'react-router';
import {
  each,
} from 'lodash';
import {
  Alert,
  Button,
  Card,
  Dimmer,
  Form,
  Header,
} from 'tabler-react';

import config from './duck/config';

import {
  usuariosSelectors,
} from './duck';

const i18nComponentKey = 'app.users.form';
const propTypes = {};
const defaultProps = {};

class UsuarioForm extends Component {
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
        type: 'danger',
        message: '',
      },
      errors: {
        name: '',
        email: '',
        password: '',
        rePassword: '',
      },
      values: {
        id: parseInt(props.match.params.id, 10) || null,
        name: '',
        email: '',
        password: '',
        rePassword: '',
      },
      loading: false,
      redirect: {
        enabled: false,
        url: config.PATHS.configuracion.usuarios,
        timeout: 5,
      },
    };
    each(usuariosSelectors, (_, k) => this[k] = usuariosSelectors[k].bind(this));
  }

  componentDidMount(){
    this.didMout();
  }

  /**
  * component render method
  * @return {reactElement} - react element itself
  */
  render() {
    const { intl } = this.props;
    const { values, errors, alert, redirect, loading } = this.state;

    if (redirect.enabled) {
      return <Redirect to={redirect.url} />;
    }

    return (
      <Card>
        <Card.Header>
          <Header.H3>{
            !values.id 
            ? intl.formatMessage({ id: `${i18nComponentKey}.title-anadir`, defaultMessage: `${i18nComponentKey}.title-anadir` })
            : intl.formatMessage({ id: `${i18nComponentKey}.title-editar`, defaultMessage: `${i18nComponentKey}.title-editar` })
            }
          </Header.H3>
        </Card.Header>
        <Card.Body>
          {alert.display && <Alert type={alert.type} icon="alert-triangle">{alert.message}</Alert>}
          <Dimmer active={loading} loader>
            <Form.Group label={intl.formatMessage({ id: `${i18nComponentKey}.name`, defaultMessage: `${i18nComponentKey}.name` })}>
              <Form.Input
                feedback={errors.name}
                invalid={errors.name !== ''}
                value={values.name}
                onChange={e => this.handleValues(e, 'name')}
              />
            </Form.Group>
            <Form.Group label={intl.formatMessage({ id: `${i18nComponentKey}.email`, defaultMessage: `${i18nComponentKey}.email` })}>
              <Form.Input
                feedback={errors.email}
                invalid={errors.email !== ''}
                value={values.email}
                onChange={e => this.handleValues(e, 'email')}
              />
            </Form.Group>
            <Form.Group label={intl.formatMessage({ id: `${i18nComponentKey}.password`, defaultMessage: `${i18nComponentKey}.password` })}>
              <Form.Input
                feedback={errors.password}
                invalid={errors.password !== ''}
                value={values.password}
                type="password"
                onChange={e => this.handleValues(e, 'password')}
              />
            </Form.Group>
            <Form.Group label={intl.formatMessage({ id: `${i18nComponentKey}.rePassword`, defaultMessage: `${i18nComponentKey}.rePassword` })}>
              <Form.Input
                feedback={errors.rePassword}
                invalid={errors.rePassword !== ''}
                value={values.rePassword}
                type="password"
                onChange={e => this.handleValues(e, 'rePassword')}
              />
            </Form.Group>
          </Dimmer>
        </Card.Body>
        <Card.Footer>
          <Button.List>
            <Button square color="success" onClick={this.submit}>
              {intl.formatMessage({ id: `${i18nComponentKey}.save`, defaultMessage: `${i18nComponentKey}.save` })}
            </Button>
          </Button.List>
        </Card.Footer>
      </Card>
    );
  }
}

UsuarioForm.propTypes = propTypes;
UsuarioForm.defaultProps = defaultProps;

export default injectIntl(
  connect(
    // mapStateToProps
    state => ({
      session: state.session,
    }),
    // mapActionsToProps
    dispatch => bindActionCreators({
      //functName,
    }, dispatch),
  )(UsuarioForm));
