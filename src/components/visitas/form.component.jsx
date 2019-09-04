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
  isNull,
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
    const id = parseInt(props.match.params.id, 10) || null;
    this.state = {
      alert: {
        display: false,
        type: 'danger',
        message: '',
      },
      errors: {
        apellido_1: '',
        email: '',
        telefono: '',
        promociones_id_1: '',
        promociones_id_2: '',
        fecha_visita: '',
      },
      values: {
        id,
        name: '',
        apellido_1: '',
        apellido_2: '',
        email: '',
        telefono: '',
        promociones_id_1: '',
        promociones_id_2: '',
        tipos_inmuebles_1: [],
        tipos_inmuebles_2: [],
        contactado: 'mail',
        observacion: '',
        observaciones: [],
        fecha_visita: new Date(),
        conociste: '',
        status: 'primera',
        users_id: parseInt(props.session.profile.id, 10),
      },
      search: !isNull(id),
      loading: false,
      promociones: {},
      redirect: {
        enabled: false,
        url: config.PATHS.visitas,
        timeout: config.REDIRECT.timeout,
      },
      venta: {
        data: {},
        modal: {
          display: false,
        },
        candidate: {
          promocion: {},
          tipo: {},
        },
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
    const { values, errors, promociones, alert, redirect, loading, search, venta } = this.state;
    const candidatos = this.candidatosVenta();

    if (isEmpty(promociones)) {
      return <Fragment />;
    }

    const inmuebles_promocion_1 = !values.promociones_id_1 ? [] : promociones[values.promociones_id_1].inmuebles;
    const inmuebles_promocion_2 = !values.promociones_id_2 ? [] : promociones[values.promociones_id_2].inmuebles;
    const ModalVentas = () => (
      <Fragment>
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{intl.formatMessage({ id: `${i18nComponentKey}.modal-ventas.title`, defaultMessage: `${i18nComponentKey}.modal-ventas.title` })}</h5>
              </div>
              <div className="modal-body">
                {map(candidatos, candidato => (
                    <Form.Radio
                      key={`${i18nComponentKey}-radios-${candidato.promocion.id}-${candidato.tipo.id}`}
                      label={`${candidato.promocion.name}: ${candidato.tipo.name}`}
                      name="candidato-venta"
                      checked={venta.candidate.promocion.id === candidato.promocion.id && venta.candidate.tipo.id === candidato.tipo.id}
                      onChange={() => this.selectVenta(candidato)}
                      isInline
                    />                  
                ))}
              </div>
              <div className="modal-footer">
                <button type="button" onClick={e => this.hideModalVentas(() => this.submit(e))} className="btn btn-secondary" data-dismiss="modal">
                  {intl.formatMessage({ id: `${i18nComponentKey}.modal-ventas.close`, defaultMessage: `${i18nComponentKey}.modal-ventas.close` })}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-backdrop fade show" />
      </Fragment>
    );

    if (redirect.enabled) {
      return <Redirect to={redirect.url} />;
    }

    return (
      <Card>
        {venta.modal.display && ModalVentas()}
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
                feedback={errors.name && false}
                invalid={errors.name !== '' && false}
                value={values.name}
                onChange={e => this.handleValues(e, 'name')}
                disabled={!search}
              />
            </Form.Group>

            <Grid.Row>
              <Grid.Col>
              <Form.Group label={intl.formatMessage({ id: `${i18nComponentKey}.apellido_1`, defaultMessage: `${i18nComponentKey}.apellido_1` })}>
                <Form.Input
                  feedback={errors.apellido_1}
                  invalid={errors.apellido_1 !== ''}
                  value={values.apellido_1}
                  onChange={e => this.handleValues(e, 'apellido_1')}
                  disabled={!search}
                />
              </Form.Group>
              </Grid.Col>
              <Grid.Col>
              <Form.Group label={intl.formatMessage({ id: `${i18nComponentKey}.apellido_2`, defaultMessage: `${i18nComponentKey}.apellido_2` })}>
                <Form.Input
                  feedback={errors.apellido_2 && false}
                  invalid={errors.apellido_2 !== '' && false}
                  value={values.apellido_2}
                  onChange={e => this.handleValues(e, 'apellido_2')}
                  disabled={!search}
                />
              </Form.Group>
              </Grid.Col>
            </Grid.Row>


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
                    disabled={!isEmpty(venta.data)}
                  >
                    <option />
                    {map(config.VISITAS.statuses, ({ key }) => <option value={key} key={`${i18nComponentKey}-stats-${key}`}>
                      {intl.formatMessage({ id: `${i18nComponentKey}.status.${key}`, defaultMessage: `${i18nComponentKey}.status.${key}` })}
                    </option>)}
                  </Form.Select>
                </Form.Group>
                {!isEmpty(venta.data) && <Alert type="success" icon="check">
                  <button onClick={e => this.handleDeleteVenta(e, venta.data.id)} class="btn btn-icon close" />
                  {intl.formatMessage(
                    { id: `${i18nComponentKey}.venta`, defaultMessage: `${i18nComponentKey}.venta` },
                    {
                      promocion: promociones[parseInt(venta.data.promocion, 10)].name || 'promición',
                      tipo: config.VISITAS.tiposInmuebles.cases[parseInt(venta.data.tipo, 10)] || `tipo inmueble: ${venta.data.tipo}`,
                    })}
                </Alert>}
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
                <Form.Group label={intl.formatMessage({ id: `${i18nComponentKey}.contactado`, defaultMessage: `${i18nComponentKey}.contactado` })}>
                  <Form.Select
                    feedback={errors.contactado}
                    invalid={false && errors.contactado !== ''}
                    value={values.contactado}
                    onChange={e => this.handleValues(e, 'contactado')}
                  >
                    <option />
                    {map(config.VISITAS.constactado, ({ key }) => <option value={key} key={`${i18nComponentKey}-contactado-${key}`}>
                      {intl.formatMessage({ id: `${i18nComponentKey}.contactado.${key}`, defaultMessage: `${i18nComponentKey}.contactado.${key}` })}
                    </option>)}
                  </Form.Select>


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
