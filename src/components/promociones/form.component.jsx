import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Redirect } from 'react-router';
import {
  ceil,
  chunk,
  each,
  isEmpty,
  map,
  size,
} from 'lodash';
import {
  Alert,
  Button,
  Card,
  Dimmer,
  Form,
  Grid,
  Header,
  Table,
} from 'tabler-react';

import config from './duck/config';

import {
  promocionesSelectors,
} from './duck';

const i18nComponentKey = 'app.promociones.form';
const propTypes = {};
const defaultProps = {};

class PromocionAnadir extends Component {
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
        zona: '',
      },
      values: {
        id: parseInt(props.match.params.id, 10) || null,
        name: '',
        zona: '',
        inmuebles: []
      },
      inmuebles: [],
      loading: false,
      redirect: {
        enabled: false,
        url: config.PATHS.configuracion.promociones,
        timeout: 5,
      },
    };
    each(promocionesSelectors, (_, k) => this[k] = promocionesSelectors[k].bind(this));
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
    const { values, errors, inmuebles, alert, redirect, loading } = this.state;

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
          <Form.Group label={intl.formatMessage({ id: `${i18nComponentKey}.zona`, defaultMessage: `${i18nComponentKey}.zona` })}>
            <Form.Input
              feedback={errors.zona}
              invalid={errors.zona !== ''}
              value={values.zona}
              onChange={e => this.handleValues(e, 'zona')}
            />
            </Form.Group>
            <Form.Group label={intl.formatMessage({ id: `${i18nComponentKey}.tipos-inmueble`, defaultMessage: `${i18nComponentKey}.tipos-inmueble`})}>
            <Dimmer active={isEmpty(inmuebles)} loader>
              <Grid.Row>
                {map(chunk(inmuebles, ceil(inmuebles.length / 3)), (arr, i) => (
                  <Grid.Col key={`${i18nComponentKey}-grid-col-${i}`}>
                    {map(arr, inmueble => (
                      <Form.Checkbox
                        key={`${i18nComponentKey}-checkbox-${inmueble.id}`}
                        label={inmueble.name}
                        name={inmueble.id}
                        value={inmueble.id}
                        checked={values.inmuebles.indexOf(parseInt(inmueble.id, 10)) !== -1}
                        onChange={this.handleInmuebles}
                      />
                    ))}
                  </Grid.Col>
                ))}
              </Grid.Row>
            </Dimmer>
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

PromocionAnadir.propTypes = propTypes;
PromocionAnadir.defaultProps = defaultProps;

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
  )(PromocionAnadir));
