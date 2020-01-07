import React, { Component, Fragment } from 'react';
import { intlShape, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  each,
  isEmpty,
  map,
  reduce,
} from 'lodash';
import {
  Alert,
  Button,
  Card,
  Dimmer,
  Form,
  Header,
  Icon,
  Table,
} from 'tabler-react';

import config from './duck/config';

import {
  statusPromocionesSelectors,
} from './duck';

const propTypes = {
  intl: intlShape.isRequired,
};
const defaultProps = {};

const i18nComponentKey = 'app.status-promociones.index';

class StatusPromociones extends Component {
  /**
  * class constructor
  * @param {obj} props - Component properties
  * @return {void}
  */
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: {
        promociones: {},
        tipos_inmuebles: {},
        reservas: {},
        ventas: {},
        visitas: {},
      },
      alert: {
        display: false,
        type: null,
        message: null,
      },
    };
    each(statusPromocionesSelectors, (_, k) => this[k] = statusPromocionesSelectors[k].bind(this));
  }

  componentDidMount(){
    this.didMount();
  }

  /**
  * component render method
  * @return {reactElement} - react element itself
  */
  render() {
    const { intl } = this.props;
    const { data, loading } = this.state;

    const layout = child => (
      <Card>
        <Card.Header>
          <Header.H3>{intl.formatMessage({ id: `${i18nComponentKey}.title`, defaultMessage: `${i18nComponentKey}.title` })}</Header.H3>
        </Card.Header>
        <Dimmer active={loading} loader className="table-container">
          {alert.display && <Alert type={alert.type} icon="alert-triangle">{alert.message}</Alert>}
          {child}
        </Dimmer>
      </Card>
      );

      if (!loading && isEmpty(data.promociones)) {
        return layout(
          <Alert type="info" className="alert-no-result">
            {intl.formatMessage({ id: `${i18nComponentKey}.no-results`, defaultMessage: `${i18nComponentKey}.no-results` })}
          </Alert>,
        );
      }
      const handleViviendasVendidas = (promocionId, tipoInmuebleId, historico) => {
        const ventas = data.ventas[promocionId] && data.ventas[promocionId][tipoInmuebleId] 
          ? data.ventas[promocionId][tipoInmuebleId]
          : 0;
        const histor = historico.venta[tipoInmuebleId]
          ? historico.venta[tipoInmuebleId]
          : 0;
        return ventas + histor;
      }
      const handleViviendasReservadas = (promocionId, tipoInmuebleId, historico) => {
        const reservas = data.reservas[promocionId] && data.reservas[promocionId][tipoInmuebleId] 
          ? data.reservas[promocionId][tipoInmuebleId]
          : 0;
        const histor = historico.reserva && historico.reserva[tipoInmuebleId]
          ? historico.reserva[tipoInmuebleId]
          : 0;
        return reservas + histor;
      }
      const returnCountViviendaReservada = (data, promocionId, historico) => {
        const rsd = reduce(data.reservas[promocionId] || {}, (sum, n) => sum + n, 0);
        const hst = reduce(historico.reserva || {}, (sum, n) => sum + n, 0);
        return rsd + hst;
      };
      const returnCountViviendaVendidas = (data, promocionId, historico) => {
        const rsd = reduce(data.ventas[promocionId] || {}, (sum, n) => sum + n, 0);
        const hst = reduce(historico.venta || {}, (sum, n) => sum + n, 0);
        return rsd + hst;
      };
      return layout(
          <div id="status-body">
            {map(data.promociones, ({ id: promocionId, name: promocionName, inmuebles, historico }) => {
              const countViviendaPromocion = reduce(inmuebles, (sum, n) => sum + n, 0);
              const countViviendaReservada = returnCountViviendaReservada(data, promocionId, historico);
              const countViviendaVendidas = returnCountViviendaVendidas(data, promocionId, historico);
              return (
                <Fragment key={`${i18nComponentKey}-promocion-${promocionId}`}>
                  <Header.H4>{promocionName}</Header.H4>
                  <Table>
                    <Table.Header>
                      <Table.ColHeader />
                      <Table.ColHeader>{intl.formatMessage({ id: `${i18nComponentKey}.totales`, defaultMessage: `${i18nComponentKey}.totales` })}</Table.ColHeader>
                      {map(config.STATUS.promocion.header, (tipoInmuebleId) => (
                        <Table.ColHeader
                          key={`${i18nComponentKey}-header-${promocionId}-${tipoInmuebleId}`}>
                            {data.tipos_inmuebles[tipoInmuebleId].name}
                        </Table.ColHeader>
                      ))}
                    </Table.Header>
                    <Table.Body>
                      <Table.Row>
                        <Table.Col>{intl.formatMessage({ id: `${i18nComponentKey}.viviendas-promocion`, defaultMessage: `${i18nComponentKey}.viviendas-promocion` })}</Table.Col>
                        <Table.Col>{countViviendaPromocion}</Table.Col>
                        {map(config.STATUS.promocion.header, (tipoInmuebleId) => (
                          <Table.Col
                            key={`${i18nComponentKey}-totales-${promocionId}-${tipoInmuebleId}`}>
                              {inmuebles[tipoInmuebleId] || 0}
                          </Table.Col>
                        ))}
                      </Table.Row>
                      <Table.Row>
                        <Table.Col>{intl.formatMessage({ id: `${i18nComponentKey}.viviendas-vendidas`, defaultMessage: `${i18nComponentKey}.viviendas-vendidas` })}</Table.Col>
                        <Table.Col>{countViviendaVendidas}</Table.Col>
                        {map(config.STATUS.promocion.header, (tipoInmuebleId) => (
                          <Table.Col
                            key={`${i18nComponentKey}-vendidas-${promocionId}-${tipoInmuebleId}`}>
                              {handleViviendasVendidas(promocionId, tipoInmuebleId, historico)}
                          </Table.Col>
                        ))}
                      </Table.Row>
                      <Table.Row>
                        <Table.Col>{intl.formatMessage({ id: `${i18nComponentKey}.viviendas-reservadas`, defaultMessage: `${i18nComponentKey}.viviendas-reservadas` })}</Table.Col>
                        <Table.Col>{countViviendaReservada}</Table.Col>
                        {map(config.STATUS.promocion.header, (tipoInmuebleId) => (
                          <Table.Col
                            key={`${i18nComponentKey}-reservadas-${promocionId}-${tipoInmuebleId}`}>
                              {handleViviendasReservadas(promocionId, tipoInmuebleId, historico)}
                          </Table.Col>
                        ))}
                      </Table.Row>
                      <Table.Row>
                        <Table.Col>{intl.formatMessage({ id: `${i18nComponentKey}.viviendas-venta`, defaultMessage: `${i18nComponentKey}.viviendas-venta` })}</Table.Col>
                        <Table.Col>{countViviendaPromocion - countViviendaReservada - countViviendaVendidas}</Table.Col>
                        {map(config.STATUS.promocion.header, (tipoInmuebleId) => (
                          <Table.Col
                            key={`${i18nComponentKey}-libres-${promocionId}-${tipoInmuebleId}`}>
                              {(inmuebles[tipoInmuebleId] || 0) - handleViviendasVendidas(promocionId, tipoInmuebleId, historico) - handleViviendasReservadas(promocionId, tipoInmuebleId, historico)}
                          </Table.Col>
                        ))}
                      </Table.Row>
                    </Table.Body>
                  </Table>
                  <hr />
                </Fragment>
              );
            })}
          </div>,
        );
  };
};

StatusPromociones.propTypes = propTypes;
StatusPromociones.defaultProps = defaultProps;

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
    )(StatusPromociones));
