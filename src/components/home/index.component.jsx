import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import C3Chart from 'react-c3js';
import {
  Card,
  Form,
  Grid,
  Header,
  Table,
} from 'tabler-react';
import {
  each,
  map,
  round,
} from 'lodash';

import 'c3/c3.css';

import config from './duck/config';

import {
  homeSelectors,
} from './duck';

const i18nComponentKey = 'app.home.index';
const propTypes = {};
const defaultProps = {};

class Home extends Component {
  /**
  * class constructor
  * @param {obj} props - Component properties
  * @return {void}
  */
  constructor(props) {
    super(props);
    this.state = {
      since: config.HOME.defaults.since,
      stats: {
        conociste: [],
        comerciales: [],
        promociones: [],
        ventas: [],
      }
    };
    each(homeSelectors, (_, k) => this[k] = homeSelectors[k].bind(this));
  }

  componentDidMount() {
    this.didMount();
  }

  render() {
    return (
      <Card>
        <Card.Header>
          <Header.H3>{this.props.intl.formatMessage({ id: `${i18nComponentKey}.title`, defaultMessage: `${i18nComponentKey}.title` })}</Header.H3>
          <Card.Options>
            <Form.Group label={this.props.intl.formatMessage({ id: `${i18nComponentKey}.select.since`, defaultMessage: `${i18nComponentKey}.select.since` })}>
              <Form.Select value={this.state.since} onChange={this.handleSince}>
                {map(config.HOME.stats.since, (_, key) => (
                  <option key={`${i18nComponentKey}-select-${key}`} value={key}>
                    {this.props.intl.formatMessage({ id: `${i18nComponentKey}.select.${key}`, defaultMessage: `${i18nComponentKey}.select.${key}` })}
                  </option>))}
              </Form.Select>
            </Form.Group>
          </Card.Options>
        </Card.Header>
        <Card.Body>
          <Grid.Row cards deck>
            <Grid.Col md={4}>
              <Card>
                <Card.Header>{this.props.intl.formatMessage({ id: `${i18nComponentKey}.header.stats.promociones`, defaultMessage: `${i18nComponentKey}.header.stats.promociones` })}</Card.Header>
                <C3Chart data={{ columns: this.state.stats.promociones, type: 'pie' }} pie={config.HOME.stats.pie} element="testchart" />
              </Card>
            </Grid.Col>
            <Grid.Col md={4}>
              <Card>
                <Card.Header>{this.props.intl.formatMessage({ id: `${i18nComponentKey}.header.stats.conociste`, defaultMessage: `${i18nComponentKey}.header.stats.conociste` })}</Card.Header>
                <C3Chart data={{ columns: this.state.stats.conociste, type: 'pie' }} pie={config.HOME.stats.pie} element="testchart" />  
              </Card>
            </Grid.Col>
            <Grid.Col md={4}>
              <Card>
                <Card.Header>{this.props.intl.formatMessage({ id: `${i18nComponentKey}.header.stats.comerciales`, defaultMessage: `${i18nComponentKey}.header.stats.comerciales` })}</Card.Header>
                <C3Chart data={{ columns: this.state.stats.comerciales, type: 'pie' }} pie={config.HOME.stats.pie} element="testchart" />
              </Card>
            </Grid.Col>
          </Grid.Row>
          <Grid.Row cards deck>
            <Grid.Col>
              {map(this.state.stats.ventas, promocion => (
                <Card key={`${i18nComponentKey}-promocion-${promocion.id}`}>
                  <Card.Header>{promocion.pname}</Card.Header>
                  <Card.Body>
                  <Table>
                    <Table.Header>
                      <Table.ColHeader>{this.props.intl.formatMessage({ id: `${i18nComponentKey}.table.col.name`, defaultMessage: `${i18nComponentKey}.table.col.name` })}</Table.ColHeader>
                      <Table.ColHeader>{this.props.intl.formatMessage({ id: `${i18nComponentKey}.table.col.cantidad`, defaultMessage: `${i18nComponentKey}.table.col.cantidad` })}</Table.ColHeader>
                      <Table.ColHeader>{this.props.intl.formatMessage({ id: `${i18nComponentKey}.table.col.vendidas`, defaultMessage: `${i18nComponentKey}.table.col.vendidas` })}</Table.ColHeader>
                      <Table.ColHeader>{this.props.intl.formatMessage({ id: `${i18nComponentKey}.table.col.percent`, defaultMessage: `${i18nComponentKey}.table.col.percent` })}</Table.ColHeader>
                    </Table.Header>
                    <Table.Body>
                    {map(promocion.inmuebles, inmueble => (
                      <Table.Row key={`${i18nComponentKey}-inmueble-${promocion.id}-${inmueble.id}`}>
                        <Table.Col>{inmueble.name}</Table.Col>
                        <Table.Col>{inmueble.cantidad}</Table.Col>
                        <Table.Col>{inmueble.vendidas}</Table.Col>
                        <Table.Col>{round((inmueble.vendidas * 100) / inmueble.cantidad)}%</Table.Col>
                      </Table.Row>
                    ))}
                    </Table.Body>
                  </Table>
                  </Card.Body>
                </Card>
              ))}
            </Grid.Col>
          </Grid.Row>
        </Card.Body>
      </Card>
    );
  }
}

Home.propTypes = propTypes;
Home.defaultProps = defaultProps;

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
  )(Home));
