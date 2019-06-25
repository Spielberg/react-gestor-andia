import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import C3Chart from 'react-c3js';
import { DateRangePicker, SingleDatePicker, DayPickerRangeController } from 'react-dates';
import moment from 'moment';
import 'moment/locale/es';
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

import {
  visitasSelectors,
} from '../visitas/duck';

const i18nComponentKey = 'app.home.index';
const propTypes = {};
const defaultProps = {};

moment().locale('es');

class Home extends Component {
  /**
  * class constructor
  * @param {obj} props - Component properties
  * @return {void}
  */
  constructor(props) {
    super(props);
    this.state = {
      since: moment()
        .subtract(config.HOME.stats.since[config.HOME.defaults.since][0], config.HOME.stats.since[config.HOME.defaults.since][1]),
      until: moment(),
      focusedInput: null, 
      promociones: {},
      promocionId: null,
      stats: {
        conociste: [],
        comerciales: [],
        promociones: [],
        ventas: [],
      }
    };
    each(homeSelectors, (_, k) => this[k] = homeSelectors[k].bind(this));
    this.fetchPromociones = visitasSelectors.fetchPromociones.bind(this);
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
            <Form.Select
                className="input-options select-promociones"
                value={this.state.promocionId}
                onChange={e => this.setState({ promocionId: e.target.value }, this.fetchHomeStats)}>
                <option />
                {map(this.state.promociones, ({ id, name }) => <option value={id} key={`${i18nComponentKey}-promocion-${id}`}>{name}</option>)}
              </Form.Select>
            <DateRangePicker
              startDate={this.state.since} // momentPropTypes.momentObj or null,
              startDateId="since" // PropTypes.string.isRequired,
              endDate={this.state.until} // momentPropTypes.momentObj or null,
              endDateId="until" // PropTypes.string.isRequired,
              onDatesChange={this.handleDates} // PropTypes.func.isRequired,
              focusedInput={this.state.focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
              onFocusChange={focusedInput => this.setState({ focusedInput })} // PropTypes.func.isRequired,
              startDatePlaceholderText={this.props.intl.formatMessage({ id: `${i18nComponentKey}.desde`, defaultMessage: `${i18nComponentKey}.desde` })}
              endDatePlaceholderText={this.props.intl.formatMessage({ id: `${i18nComponentKey}.hasta`, defaultMessage: `${i18nComponentKey}.hasta` })}
              enableOutsideDays={true}
              isOutsideRange={() => false}
            />
          </Card.Options>
        </Card.Header>
        <Card.Body>
          <Grid.Row cards deck>
            <Grid.Col md={4}>
              <Card>
                <Card.Header>{this.props.intl.formatMessage({ id: `${i18nComponentKey}.header.stats.promociones`, defaultMessage: `${i18nComponentKey}.header.stats.promociones` })}</Card.Header>
                <C3Chart data={{ columns: this.state.stats.promociones, type: 'pie', unload: true }} pie={config.HOME.stats.pie} element="promocioneschart" />
              </Card>
            </Grid.Col>
            <Grid.Col md={4}>
              <Card>
                <Card.Header>{this.props.intl.formatMessage({ id: `${i18nComponentKey}.header.stats.conociste`, defaultMessage: `${i18nComponentKey}.header.stats.conociste` })}</Card.Header>
                <C3Chart data={{ columns: this.state.stats.conociste, type: 'pie', unload: true }} pie={config.HOME.stats.pie} element="conocistechart" />  
              </Card>
            </Grid.Col>
            <Grid.Col md={4}>
              <Card>
                <Card.Header>{this.props.intl.formatMessage({ id: `${i18nComponentKey}.header.stats.comerciales`, defaultMessage: `${i18nComponentKey}.header.stats.comerciales` })}</Card.Header>
                <C3Chart data={{ columns: this.state.stats.comerciales, type: 'pie', unload: true }} pie={config.HOME.stats.pie} element="comercialeschart" />
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
