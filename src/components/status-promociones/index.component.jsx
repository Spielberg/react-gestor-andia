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

      const handleViviendasVendidas = (promocionId, tipoInmuebleId) => (
        data.ventas[promocionId]
          ? data.ventas[promocionId][tipoInmuebleId] || 0
          : 0
      );
      return layout(
          <div id="status-body">
            {map(data.promociones, ({ id: promocionId, name: promocionName, inmuebles }) => (
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
                      <Table.Col>{reduce(inmuebles, (sum, n) => sum + n, 0)}</Table.Col>
                      {map(config.STATUS.promocion.header, (tipoInmuebleId) => (
                        <Table.Col
                          key={`${i18nComponentKey}-totales-${promocionId}-${tipoInmuebleId}`}>
                            {inmuebles[tipoInmuebleId] || 0}
                        </Table.Col>
                      ))}
                    </Table.Row>
                    <Table.Row>
                      <Table.Col>{intl.formatMessage({ id: `${i18nComponentKey}.viviendas-vendidas`, defaultMessage: `${i18nComponentKey}.viviendas-vendidas` })}</Table.Col>
                      <Table.Col>{reduce(data.ventas[promocionId] || {}, (sum, n) => sum + n, 0)}</Table.Col>
                      {map(config.STATUS.promocion.header, (tipoInmuebleId) => (
                        <Table.Col
                          key={`${i18nComponentKey}-vendidas-${promocionId}-${tipoInmuebleId}`}>
                            {handleViviendasVendidas(promocionId, tipoInmuebleId)}
                        </Table.Col>
                      ))}
                    </Table.Row>
                    <Table.Row>
                      <Table.Col>{intl.formatMessage({ id: `${i18nComponentKey}.viviendas-libres`, defaultMessage: `${i18nComponentKey}.viviendas-libres` })}</Table.Col>
                      <Table.Col>{reduce(inmuebles, (sum, n) => sum + n, 0) - reduce(data.ventas[promocionId] || {}, (sum, n) => sum + n, 0)}</Table.Col>
                      {map(config.STATUS.promocion.header, (tipoInmuebleId) => (
                        <Table.Col
                          key={`${i18nComponentKey}-libres-${promocionId}-${tipoInmuebleId}`}>
                            {(inmuebles[tipoInmuebleId] || 0) - handleViviendasVendidas(promocionId, tipoInmuebleId)}
                        </Table.Col>
                      ))}
                    </Table.Row>
                  </Table.Body>
                </Table>
                {/*
                <Table>
                  <Table.Header>
                    <Table.ColHeader>{intl.formatMessage({ id: `${i18nComponentKey}.visitas`, defaultMessage: `${i18nComponentKey}.visitas` })}</Table.ColHeader>
                    <Table.ColHeader />
                    <Table.ColHeader>{intl.formatMessage({ id: `${i18nComponentKey}.ventas`, defaultMessage: `${i18nComponentKey}.ventas` })}</Table.ColHeader>
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
                      <Table.Col>{reduce(inmuebles, (sum, n) => sum + n, 0)}</Table.Col>
                      {map(config.STATUS.promocion.header, (tipoInmuebleId) => (
                        <Table.Col
                          key={`${i18nComponentKey}-totales-${promocionId}-${tipoInmuebleId}`}>
                            {inmuebles[tipoInmuebleId] || 0}
                        </Table.Col>
                      ))}
                    </Table.Row>
                    {map(data.ventas_by_month[promocionId], (ventasMonth, year) => {
                    })}
                    <Table.Row>
                      <Table.Col>{intl.formatMessage({ id: `${i18nComponentKey}.viviendas-vendidas`, defaultMessage: `${i18nComponentKey}.viviendas-vendidas` })}</Table.Col>
                      <Table.Col>###</Table.Col>
                      {map(config.STATUS.promocion.header, (tipoInmuebleId) => (
                        <Table.Col
                          key={`${i18nComponentKey}-vendidas-${promocionId}-${tipoInmuebleId}`}>
                            {handleViviendasVendidas(promocionId, tipoInmuebleId)}
                        </Table.Col>
                      ))}
                    </Table.Row>
                    <Table.Row>
                      <Table.Col>{intl.formatMessage({ id: `${i18nComponentKey}.viviendas-libres`, defaultMessage: `${i18nComponentKey}.viviendas-libres` })}</Table.Col>
                      <Table.Col>{reduce(inmuebles, (sum, n) => sum + n, 0) - reduce(data.ventas[promocionId] || {}, (sum, n) => sum + n, 0)}</Table.Col>
                      {map(config.STATUS.promocion.header, (tipoInmuebleId) => (
                        <Table.Col
                          key={`${i18nComponentKey}-libres-${promocionId}-${tipoInmuebleId}`}>
                            {(inmuebles[tipoInmuebleId] || 0) - handleViviendasVendidas(promocionId, tipoInmuebleId)}
                        </Table.Col>
                      ))}
                    </Table.Row>
                  </Table.Body>
                </Table>
                */}
                <hr />
              </Fragment>
            ))}
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
