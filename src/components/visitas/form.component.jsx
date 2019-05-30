import React, { Component, Fragment } from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Redirect } from 'react-router';
import { Typeahead } from 'react-bootstrap-typeahead';
import moment from 'moment';
import {
  ceil,
  chunk,
  each,
  isEmpty,
  range,
  map,
} from 'lodash';
import {
  Alert,
  Button,
  Card,
  Dimmer,
  Form,
  Grid,
  Header,
  Notification,
} from 'tabler-react';

import 'react-bootstrap-typeahead/css/Typeahead.css';
import 'react-bootstrap-typeahead/css/Typeahead-bs4.css';

import config from './duck/config';

import {
  visitasSelectors,
} from './duck';

const i18nComponentKey = 'app.visitas.form';
const propTypes = {};
const defaultProps = {};

class VisitasForm extends Component {
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
        telefono: '',
        promociones_id_1: '',
        promociones_id_2: '',
        fecha_visita: '',
      },
      values: {
        id: parseInt(props.match.params.id, 10) || null,
        name: '',
        email: '',
        telefono: '',
        promociones_id_1: '',
        promociones_id_2: '',
        tipos_inmuebles_1: [],
        tipos_inmuebles_2: [],
        publicidad: true,
        observacion: '',
        observaciones: [],
        fecha_visita: new Date(),
        conociste: '',
        status: 'primera',
        users_id: parseInt(props.session.profile.id, 10),
      },
      search: false,
      loading: false,
      promociones: {},
      redirect: {
        enabled: false,
        url: config.PATHS.visitas,
        timeout: config.REDIRECT.timeout,
      },
    };
    each(visitasSelectors, (_, k) => this[k] = visitasSelectors[k].bind(this));
  }

  componentDidMount() {
    this.didMout();
  }

  /**
  * component render method
  * @return {reactElement} - react element itself
  */
  render() {
    const { intl } = this.props;
    const { values, errors, promociones, alert, redirect, loading, search } = this.state;

    if (isEmpty(promociones)) {
      return <Fragment />;
    }

    const inmuebles_promocion_1 = !values.promociones_id_1 ? [] : promociones[values.promociones_id_1].inmuebles;
    const inmuebles_promocion_2 = !values.promociones_id_2 ? [] : promociones[values.promociones_id_2].inmuebles;

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
          <Form.Group label={intl.formatMessage({ id: `${i18nComponentKey}.telefono`, defaultMessage: `${i18nComponentKey}.telefono` })}>
              <Form.Input
                feedback={errors.telefono}
                invalid={errors.telefono !== ''}
                value={values.telefono}
                onChange={e => this.handleValues(e, 'telefono')}
                onKeyPress={this.catchReturn}
              />
            </Form.Group>
            <Form.Group label={intl.formatMessage({ id: `${i18nComponentKey}.name`, defaultMessage: `${i18nComponentKey}.name` })}>
              <Form.Input
                feedback={errors.name}
                invalid={errors.name !== ''}
                value={values.name}
                onChange={e => this.handleValues(e, 'name')}
                disabled={!search}
              />
            </Form.Group>
            <Form.Group label={intl.formatMessage({ id: `${i18nComponentKey}.email`, defaultMessage: `${i18nComponentKey}.email` })}>
              <Form.Input
                feedback={errors.email}
                invalid={errors.email !== ''}
                value={values.email}
                onChange={e => this.handleValues(e, 'email')}
                disabled={!search}
              />
            </Form.Group>
            <Grid.Row>
              <Grid.Col>
                <Form.Group label={intl.formatMessage({ id: `${i18nComponentKey}.promociones`, defaultMessage: `${i18nComponentKey}.promociones` })}>
                  <Form.Select
                    feedback={errors.promociones_id_1}
                    invalid={errors.promociones_id_1 !== ''}
                    value={values.promociones_id_1}
                    onChange={e => this.handlePromocion(e, 'promociones_id_1')}
                  >
                    <option />
                    {map(promociones, ({ id, name }) => <option value={id} key={`${i18nComponentKey}-promocion-${id}`}>{name}</option>)}
                  </Form.Select>
                </Form.Group>
              </Grid.Col>
              <Grid.Col>
                <Form.Group label={intl.formatMessage({ id: `${i18nComponentKey}.promociones`, defaultMessage: `${i18nComponentKey}.promociones` })}>
                  <Form.Select
                    feedback={false}
                    invalid={false}
                    value={values.promociones_id_2}
                    onChange={e => this.handlePromocion(e, 'promociones_id_2')}
                  >
                    <option />
                    {map(promociones, ({ id, name }) => <option value={id} key={`${i18nComponentKey}-promocion-${id}`}>{name}</option>)}
                  </Form.Select>
                </Form.Group>
              </Grid.Col>
            </Grid.Row>
            <Grid.Row>
              <Grid.Col>
                {map(inmuebles_promocion_1, inmueble => (
                  <Form.Checkbox
                    key={`${i18nComponentKey}-checkbox-${inmueble.id}`}
                    label={inmueble.name}
                    name={inmueble.id}
                    value={inmueble.id}
                    checked={values.tipos_inmuebles_1.indexOf(parseInt(inmueble.id, 10)) !== -1}
                    onChange={e => this.handleInmuebles(inmueble.id, 'tipos_inmuebles_1')}
                  />
                ))}
                </Grid.Col>
                <Grid.Col>
                  {map(inmuebles_promocion_2, inmueble => (
                    <Form.Checkbox
                      key={`${i18nComponentKey}-checkbox-${inmueble.id}`}
                      label={inmueble.name}
                      name={inmueble.id}
                      value={inmueble.id}
                      checked={values.tipos_inmuebles_2.indexOf(parseInt(inmueble.id, 10)) !== -1}
                      onChange={e => this.handleInmuebles(inmueble.id, 'tipos_inmuebles_2')}
                    />
                  ))}
                </Grid.Col>
              </Grid.Row>
              <Grid.Row>
              <Grid.Col>
                <Form.Group label={intl.formatMessage({ id: `${i18nComponentKey}.status`, defaultMessage: `${i18nComponentKey}.status` })}>
                  <Form.Select
                    feedback={errors.status}
                    invalid={false && errors.status !== ''}
                    value={values.status}
                    onChange={e => this.handleValues(e, 'status')}
                  >
                    <option />
                    {map(config.VISITAS.statuses, ({ key }) => <option value={key} key={`${i18nComponentKey}-stats-${key}`}>
                      {intl.formatMessage({ id: `${i18nComponentKey}.status.${key}`, defaultMessage: `${i18nComponentKey}.status.${key}` })}
                    </option>)}
                  </Form.Select>
                </Form.Group>
              </Grid.Col>
              <Grid.Col>
                <Form.Group label={intl.formatMessage({ id: `${i18nComponentKey}.conociste`, defaultMessage: `${i18nComponentKey}.conociste` })}>
                <Form.Select
                    feedback={errors.conociste}
                    invalid={false && errors.conociste !== ''}
                    value={values.conociste}
                    onChange={e => this.handleValues(e, 'conociste')}
                  >
                    <option />
                    {map(config.VISITAS.conociste, (key) => <option value={key} key={`${i18nComponentKey}-conociste-${key}`}>
                      {intl.formatMessage({ id: `app.conociste.${key}`, defaultMessage: `app.conociste.${key}` })}
                    </option>)}
                  </Form.Select>
                </Form.Group>
              </Grid.Col>
            </Grid.Row>
            <Grid.Row>
              <Grid.Col>
              <Form.Group label={intl.formatMessage({ id: `${i18nComponentKey}.fecha_visita`, defaultMessage: `${i18nComponentKey}.fecha_visita` })}>
                  <Form.DatePicker
                    feedback={errors.fecha_visita}
                    invalid={errors.fecha_visita !== ''}
                    value={values.fecha_visita}
                    onChange={fecha => this.setValue('fecha_visita', fecha)}
                    monthLabels={map(range(11), i => intl.formatMessage({ id: `${i18nComponentKey}.months.${i}`, defaultMessage: `${i18nComponentKey}.months.${i}` }))}
                  />
                </Form.Group>
              </Grid.Col>
              <Grid.Col>
                <Form.Group label={intl.formatMessage({ id: `${i18nComponentKey}.publicidad`, defaultMessage: `${i18nComponentKey}.publicidad` })}>
                  <Form.Checkbox
                    label={intl.formatMessage({ id: `${i18nComponentKey}.si`, defaultMessage: `${i18nComponentKey}.si` })}
                    onChange={() => this.setValue('publicidad', !values.publicidad)}
                    name="publicidad"
                    checked={values.publicidad}
                    value={values.publicidad}
                  />
                </Form.Group>
              </Grid.Col>
            </Grid.Row>
            <Form.Group label={intl.formatMessage({ id: `${i18nComponentKey}.observaciones`, defaultMessage: `${i18nComponentKey}.observaciones` })}>
              <Form.Textarea
                feedback={errors.observacion}
                invalid={false && errors.observacion !== ''}
                value={values.observacion}
                onChange={e => this.handleValues(e, 'observacion')}
              />
            </Form.Group>
            {values.observaciones && 
            map(values.observaciones, ({ created_at, text }) => (
              <div className="d-flex alert alert-secondary notificacion-observaciones" key={`${i18nComponentKey}-${created_at}`}>
                <Notification
                  message={text}
                  time={moment(created_at).format(config.DEFAULT.DATE_TIME_FORMAT)}
                />
              </div>
            ))}
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

VisitasForm.propTypes = propTypes;
VisitasForm.defaultProps = defaultProps;

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
  )(VisitasForm));
