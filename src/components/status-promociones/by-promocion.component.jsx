import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

const i18nComponentKey = 'app.status-promociones.index';
const propTypes = {};
const defaultProps = {};

const ByPromocion = () => (
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
);

ByPromocion.propTypes = propTypes;
ByPromocion.defaultProps = defaultProps;

export default injectIntl(
  connect(
    // mapStateToProps
    state => ({
      locale: state.i18n.locale,
    }),
    // mapActionsToProps
    dispatch => bindActionCreators({
      //functName,
    }, dispatch),
  )(ByPromocion));
