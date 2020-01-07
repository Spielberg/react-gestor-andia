import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Redirect } from 'react-router';
import { Typeahead } from 'react-bootstrap-typeahead';
import {
  ceil,
  chunk,
  each,
  first,
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

import 'react-bootstrap-typeahead/css/Typeahead.css';
import 'react-bootstrap-typeahead/css/Typeahead-bs4.css';

import config from './duck/config';

import {
  promocionesSelectors,
} from './duck';

const i18nComponentKey = 'app.promociones.form';
const propTypes = {};
const defaultProps = {};

class PromocionForm extends Component {
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
        historico: {
          reserva: {},
          venta: {},
        },
        inmuebles: {}
      },
      inmuebles: [],
      zonas: [],
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
    const { values, errors, inmuebles, alert, redirect, loading, zonas } = this.state;

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
              <Typeahead
                id={`${i18nComponentKey}-zona-typeahead`}
                labelKey="name"
                options={zonas}
                emptyLabel={''}
                maxResults={3}
                paginationText={intl.formatMessage({ id: `${i18nComponentKey}.zona.pagination`, defaultMessage: `${i18nComponentKey}.zona.pagination` })}
                onInputChange={this.handleZona}
                onChange={(zonas) => this.handleZona(first(zonas))}
                placeholder={values.zona}
              />
            </Form.Group>
            <Form.Group label={intl.formatMessage({ id: `${i18nComponentKey}.tipos-inmueble`, defaultMessage: `${i18nComponentKey}.tipos-inmueble`})}>
            <Dimmer active={isEmpty(inmuebles)} loader>
              <Grid.Row>
                {map(chunk(inmuebles, ceil(inmuebles.length / 2)), (arr, i) => (
                  <Grid.Col key={`${i18nComponentKey}-grid-col-input-${i}`}>
                    {map(arr, inmueble => (
                      <Fragment key={`${i18nComponentKey}-input-${inmueble.id}`}>
                        <div className="input-icon tipos-inmuebles">
                          <span className="input-icon-addon">{inmueble.name}</span>
                          <Form.Input
                            className="cantidad-tipo-inmueble"
                            name={inmueble.id}
                            value={values.inmuebles[inmueble.id] || ''}
                            onChange={e => this.handleInmuebles(e, inmueble.id)}
                            placeholder={intl.formatMessage({ id: `${i18nComponentKey}.cantidad`, defaultMessage: `${i18nComponentKey}.cantidad` }, { ...inmueble })}
                            type="number"
                          />
                        </div>
                      </Fragment>
                    ))}
                  </Grid.Col>
                ))}
              </Grid.Row>
            </Dimmer>
            </Form.Group>
            <Form.Group label={intl.formatMessage({ id: `${i18nComponentKey}.historico.reservas`, defaultMessage: `${i18nComponentKey}.historico.reservas`})}>
            <Dimmer active={isEmpty(inmuebles)} loader>
              <Grid.Row>
                {map(chunk(inmuebles, ceil(inmuebles.length / 2)), (arr, i) => (
                  <Grid.Col key={`${i18nComponentKey}-grid-col-input-historico-${i}`}>
                    {map(arr, inmueble => (
                      <Fragment key={`${i18nComponentKey}-input-${inmueble.id}`}>
                        <div className="input-icon tipos-inmuebles">
                          <span className="input-icon-addon">{inmueble.name}</span>
                          <Form.Input
                            className="cantidad-tipo-inmueble"
                            name={inmueble.id}
                            value={values.historico.reserva[inmueble.id] || ''}
                            onChange={e => this.handleHistorico(e, 'reserva', inmueble.id)}
                            placeholder={intl.formatMessage({ id: `${i18nComponentKey}.cantidad`, defaultMessage: `${i18nComponentKey}.cantidad` }, { ...inmueble })}
                            type="number"
                          />
                        </div>
                      </Fragment>
                    ))}
                  </Grid.Col>
                ))}
              </Grid.Row>
            </Dimmer>
            </Form.Group>
            <Form.Group label={intl.formatMessage({ id: `${i18nComponentKey}.historico.venta`, defaultMessage: `${i18nComponentKey}.historico.venta`})}>
            <Dimmer active={isEmpty(inmuebles)} loader>
              <Grid.Row>
                {map(chunk(inmuebles, ceil(inmuebles.length / 2)), (arr, i) => (
                  <Grid.Col key={`${i18nComponentKey}-grid-col-input-historico-${i}`}>
                    {map(arr, inmueble => (
                      <Fragment key={`${i18nComponentKey}-input-${inmueble.id}`}>
                        <div className="input-icon tipos-inmuebles">
                          <span className="input-icon-addon">{inmueble.name}</span>
                          <Form.Input
                            className="cantidad-tipo-inmueble"
                            name={inmueble.id}
                            value={values.historico.venta[inmueble.id] || ''}
                            onChange={e => this.handleHistorico(e, 'venta', inmueble.id)}
                            placeholder={intl.formatMessage({ id: `${i18nComponentKey}.cantidad`, defaultMessage: `${i18nComponentKey}.cantidad` }, { ...inmueble })}
                            type="number"
                          />
                        </div>
                      </Fragment>
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

PromocionForm.propTypes = propTypes;
PromocionForm.defaultProps = defaultProps;

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
  )(PromocionForm));
