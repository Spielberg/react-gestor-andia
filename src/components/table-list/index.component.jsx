import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { intlShape, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import { DateRangePicker } from 'react-dates';
import moment from 'moment';
import 'moment/locale/es';
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

import {
  ceil,
  filter,
  reduce,
  size,
  each,
  map,
  orderBy,
} from 'lodash';

import {
  tableListSelectors,
} from './duck';

import {
  visitasSelectors,
} from '../visitas/duck';

import config from './duck/config';

import TableCol from './functionals/table-col.component';
import FilterVisitasStatus from './functionals/filter-visitas-status.component';

import Pagination from '../../mixins/pagination.component';

import enviosHOC from '../envios/modal.hoc';

const i18nComponentKey = 'app.table-list.index';

const propTypes = {
  intl: intlShape.isRequired,
  url: PropTypes.string.isRequired,
  session: PropTypes.object.isRequired,
  columns: PropTypes.object.isRequired,
  selected: PropTypes.bool,
  addUrl: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([null]),
  ]),
  editUrl: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([null]),
  ]),
  excelUrl: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([null]),
  ]),
  i18nKey: PropTypes.string,
  isPromociones: PropTypes.bool,
  visitas: PropTypes.bool,
};

const defaultProps = {
  addUrl: null,
  editUrl: null,
  excelUrl: null,
  i18nKey: i18nComponentKey,
  isPromociones: false,
  selected: false,
  visitas: false,
};

class TableList extends Component {
  /**
  * class constructor
  * @param {obj} props - Component properties
  * @return {void}
  */
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      promocion_id: '',
      promociones: [],
      offset: 0,
      query: '',
      pagination: {},
      results: {},
      status: '',
      modal: {
        candidate: null,
        display: false,
      },
      filterPromociones: {
        active: true,
      },
      filterVisitas: {
        display: false,
        since: moment('2019-01-01'),
        until: moment(),
      },
      focusedInput: null,
    };
    each(tableListSelectors, (_, k) => this[k] = tableListSelectors[k].bind(this));
    this.fetchPromociones = visitasSelectors.fetchPromociones.bind(this);
  }

  componentDidMount(){
    this.onMount();
  }

  /**
  * component render method
  * @return {reactElement} - react element itself
  */
  render() {
    const { addUrl, excelUrl, editUrl, intl, columns, i18nKey, isPromociones, selected, visitas } = this.props;
    const { filterPromociones, filterVisitas, loading, offset, modal, results, pagination, promocion_id, promociones, query, status } = this.state;
    const candidates = filter(results, 'selected');
    const selectedCount = size(candidates);
    
    const ModalVisitas = () => (
      <Fragment>
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{intl.formatMessage({ id: `${i18nKey}.filter-visitas.title`, defaultMessage: `${i18nKey}.filter-visitas.title` })}</h5>
                <button type="button" onClick={this.hideFilterVisitas} className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true" />
                </button>
              </div>
              <div className="modal-body">
                <Form.Group label={intl.formatMessage({ id: `${i18nKey}.filter-visitas.buscar`, defaultMessage: `${i18nKey}.filter-visitas.buscar` })}>
                  <Form.Input
                    icon="search"
                    placeholder={intl.formatMessage({ id: `${i18nKey}.filter-visitas.buscar`, defaultMessage: `${i18nKey}.filter-visitas.buscar` })}
                    position="append"
                    value={query}
                    onChange={this.handleQuery}
                    onKeyPress={this.catchReturn}
                  />
                </Form.Group>
                <Form.Group label={intl.formatMessage({ id: `${i18nKey}.filter-visitas.promociones`, defaultMessage: `${i18nKey}.filter-visitas.promociones` })}>
                  <Form.Select
                    className="input-options select-promociones is-fullwidth"
                    value={promocion_id}
                    onChange={e => this.setState({ promocion_id: e.target.value }, this.fetch)}>
                    <option />
                    {Object.values(promociones)
                      .filter(({ home }) => home)
                      .sort(({ name: A }, { name: B }) => A === B ? 0 : A < B ? -1 : 1)
                      .map(({ id, name }) => <option value={id} key={`${i18nKey}-promocion-${id}`}>{name}</option>)}
                  </Form.Select>
                </Form.Group>
                <Form.Group label={intl.formatMessage({ id: `${i18nKey}.filter-visitas.status`, defaultMessage: `${i18nKey}.filter-visitas.status` })}>
                  <FilterVisitasStatus
                    status={status}
                    onChange={e => this.setState({ status: e.target.value }, this.fetch)}
                  />
                </Form.Group>
                <Form.Group label={intl.formatMessage({ id: `${i18nKey}.filter-visitas.fechas`, defaultMessage: `${i18nKey}.filter-visitas.fechas` })}>
                  <DateRangePicker
                    startDate={this.state.filterVisitas.since} // momentPropTypes.momentObj or null,
                    startDateId="since" // PropTypes.string.isRequired,
                    endDate={this.state.filterVisitas.until} // momentPropTypes.momentObj or null,
                    endDateId="until" // PropTypes.string.isRequired,
                    onDatesChange={this.handleDates} // PropTypes.func.isRequired,
                    focusedInput={this.state.focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
                    onFocusChange={focusedInput => this.setState({ focusedInput })} // PropTypes.func.isRequired,
                    startDatePlaceholderText={this.props.intl.formatMessage({ id: `${i18nKey}.desde`, defaultMessage: `${i18nKey}.desde` })}
                    endDatePlaceholderText={this.props.intl.formatMessage({ id: `${i18nKey}.hasta`, defaultMessage: `${i18nKey}.hasta` })}
                    enableOutsideDays={true}
                    isOutsideRange={() => false}
                  />
                </Form.Group>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={this.hideFilterVisitas} className="btn btn-secondary" data-dismiss="modal">
                  {intl.formatMessage({ id: `${i18nKey}.filter-visitas.close`, defaultMessage: `${i18nKey}.filter-visitas.close` })}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-backdrop fade show" />
      </Fragment>
    );

    const layout = child => (
      <Card>
        {filterVisitas.display && ModalVisitas()}
        <Card.Header>
          <Header.H3>{intl.formatMessage({ id: `${i18nKey}.title`, defaultMessage: `${i18nKey}.title` })}</Header.H3>
          <Card.Options>
              {!visitas && 
                <Form.Input
                  icon="search"
                  placeholder={intl.formatMessage({ id: `${i18nComponentKey}.buscar`, defaultMessage: `${i18nComponentKey}.buscar` })}
                  position="append"
                  value={query}
                  onChange={this.handleQuery}
                  onKeyPress={this.catchReturn}
                />
              }
            <Button.List align="right">
              {isPromociones &&
                <Button className="is-margin-left-15" color={filterPromociones.active ? 'warning' : 'success'} onClick={this.handleFilterPromociones}>{!filterPromociones.active
                  ? intl.formatMessage({ id: `${i18nKey}.hide-active`, defaultMessage: `${i18nKey}.hide-active` })
                  : intl.formatMessage({ id: `${i18nKey}.display-active`, defaultMessage: `${i18nKey}.display-active` })
                }
                </Button>
              }
              {addUrl && <Link to={addUrl} className="btn-add">
                <Button color="primary">{intl.formatMessage({ id: `${i18nKey}.nuevo`, defaultMessage: `${i18nKey}.nuevo` })}</Button>
              </Link>}
              {excelUrl && <Button onClick={() => this.requestExcel(excelUrl)} color="secundary" outline>
                  {intl.formatMessage({ id: `${i18nKey}.excel`, defaultMessage: `${i18nKey}.excel` })}
                </Button>}
              {selectedCount > 0 && 
                <Button color="secundary" icon="mail" onClick={e => this.props.modalEnvios.open(candidates)}>
                  {intl.formatMessage({ id: `${i18nKey}.send`, defaultMessage: `${i18nKey}.send` })}
                </Button>}
              {visitas && 
                <Button color="secundary" icon="mail" onClick={e => this.props.modalEnvios.open([], true)}>
                  {intl.formatMessage({ id: `${i18nKey}.newsletter`, defaultMessage: `${i18nKey}.newsletter` })}
                </Button>}
              {visitas && 
                <button type="button" onClick={this.showFilterVisitas} className="btn btn-warning">
                  {intl.formatMessage({ id: `${i18nKey}.filter-visitas.filter`, defaultMessage: `${i18nKey}.filter-visitas.filter` })}
                </button>}
              {visitas && 
              <button type="button" onClick={this.clearFilterVisitas} className="btn btn-info">
                {intl.formatMessage({ id: `${i18nKey}.filter-visitas.clear`, defaultMessage: `${i18nKey}.filter-visitas.clear` })}
              </button>}
            </Button.List>
          </Card.Options>
        </Card.Header>
        <Dimmer active={loading} loader className="table-container">
          {child}
        </Dimmer>
      </Card>
      );

      if (!loading && pagination.total === 0) {
        return layout(
          <Alert type="info" className="alert-no-result">{intl.formatMessage({ id: `${i18nKey}.no-results`, defaultMessage: `${i18nKey}.no-results` })}</Alert>,
        );
      }

      return layout(
        <Fragment>
          <Table>
              <Table.Header>
                {selected && <Table.ColHeader />}
                {map(columns.payload, column => (
                  <Table.ColHeader key={`${i18nKey}.col-header.${column.key}`}>
                    {intl.formatMessage({ id: `${i18nKey}.column.${column.i18n(column)}`, defaultMessage: `${i18nKey}.column.${column.i18n(column)}` })}
                  </Table.ColHeader>
                ))}
                {editUrl && <Table.ColHeader>{intl.formatMessage({ id: `${i18nComponentKey}.column.actions`, defaultMessage: `${i18nComponentKey}.column.actions` })}</Table.ColHeader>}
              </Table.Header>
                <Table.Body>
                  {map(orderBy(results, 'created_at', 'desc'), obj => (
                    <Table.Row key={`${i18nKey}.row.${obj.id}`}>
                      {selected && 
                        <Table.Col>
                          {!obj.publicidad
                          ? <Icon
                              className="select-icon disabled"
                              key={`${i18nKey}.selected.${obj.id}`}
                              name="alert-circle"
                            />                          
                          : <Icon
                              className="select-icon"
                              key={`${i18nKey}.selected.${obj.id}`}
                              onClick={() => this.handleSelect(obj)}
                              name={obj.selected ? 'check-circle' : 'circle'}
                            />}
                      </Table.Col>}
                      {map(columns.payload, column => <Table.Col key={`${i18nKey}.col.${obj.id}.${column.key}`}>
                        <TableCol
                          column={column}
                          handleActive={() => this.handleActive(obj)}
                          handleSuperuser={() => this.handleSuperuser(obj)}
                          handleHome={() => this.handleHome(obj)}
                          showModal={() => this.showModal(obj)}
                          i18nKey={i18nKey}
                          obj={obj}
                        />
                      </Table.Col>)}
                      <Table.Col>
                        {editUrl && <Link to={this.urlFor(editUrl, { id: obj.id })} className="btn-add">
                          <Button color="primary" size="sm" pill>{intl.formatMessage({ id: `${i18nComponentKey}.btn.edit`, defaultMessage: `${i18nComponentKey}.btn.edit` })}</Button>
                        </Link>}
                      </Table.Col>
                    </Table.Row>))}
                </Table.Body>
            </Table>
            {pagination.total > pagination.limit && <Pagination
              current={offset + 1}
              last={ceil(pagination.total / pagination.limit)}
              onClick={this.handleOffset}
            />}
            {modal.display && <Fragment>
              <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" role="dialog">
                <div className="modal-dialog" role="document">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">{intl.formatMessage({ id: `${i18nKey}.modal.title`, defaultMessage: `${i18nKey}.modal.title` })}</h5>
                      <button type="button" onClick={this.hideModal} className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true" />
                      </button>
                    </div>
                    <div className="modal-body">
                      <p>{intl.formatMessage({ id: `${i18nKey}.modal.body`, defaultMessage: `${i18nKey}.modal.body` })}</p>
                    </div>
                    <div className="modal-footer">
                      <button type="button" onClick={this.handleDelete} className="btn btn-primary">{intl.formatMessage({ id: `${i18nKey}.modal.delete`, defaultMessage: `${i18nKey}.modal.delete` })}</button>
                      <button type="button" onClick={this.hideModal} className="btn btn-secondary" data-dismiss="modal">{intl.formatMessage({ id: `${i18nKey}.modal.close`, defaultMessage: `${i18nKey}.modal.close` })}</button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-backdrop fade show" />
            </Fragment>}
          </Fragment>
      );
  };
};

TableList.propTypes = propTypes;
TableList.defaultProps = defaultProps;

export default enviosHOC(
  injectIntl(
    connect(
      // mapStateToProps
      state => ({
        session: state.session,
      }),
      // mapActionsToProps
      dispatch => bindActionCreators({
        //functName,
      }, dispatch),
    )(TableList)));
