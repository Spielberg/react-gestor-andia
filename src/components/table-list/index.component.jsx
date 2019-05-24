import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { intlShape, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
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
  reduce,
  each,
  map,
  size,
} from 'lodash';

import {
  tableListSelectors,
} from './duck';

import config from './duck/config';

import TableCol from './functionals/table-col.component';

import Pagination from '../../mixins/pagination.component';

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
  i18nKey: PropTypes.string,
};

const defaultProps = {
  selected: false,
  i18nKey: i18nComponentKey,
  addUrl: null,
  editUrl: null,
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
      offset: 0,
      query: '',
      pagination: {},
      results: {},
    };
    each(tableListSelectors, (_, k) => this[k] = tableListSelectors[k].bind(this));
  }

  componentDidMount(){
    this.onMount();
  }

  /**
  * component render method
  * @return {reactElement} - react element itself
  */
  render() {
    const { addUrl, editUrl, intl, columns, i18nKey, selected } = this.props;
    const { loading, offset, results, pagination, query } = this.state;
    const selectedCount = reduce(results, (result, obj) => result + (obj.selected ? 1 : 0), 0);

    const layout = child => (
      <Card>
        <Card.Header>
          <Header.H3>{intl.formatMessage({ id: `${i18nKey}.title`, defaultMessage: `${i18nKey}.title` })}</Header.H3>
          <Card.Options>
            <Form.Input
              icon="search"
              placeholder={intl.formatMessage({ id: `${i18nComponentKey}.buscar`, defaultMessage: `${i18nComponentKey}.buscar` })}
              position="append"
              value={query}
              onChange={this.handleQuery}
              onKeyPress={this.catchReturn}
            />
            <Button.List>
              {addUrl && <Link to={addUrl} className="btn-add">
                <Button color="primary">{intl.formatMessage({ id: `${i18nKey}.nuevo`, defaultMessage: `${i18nKey}.nuevo` })}</Button>
              </Link>}
              {selectedCount && <Link to={addUrl} className="btn-add">
                <Button color="secundary" icon="mail">
                  {intl.formatMessage({ id: `${i18nKey}.send`, defaultMessage: `${i18nKey}.send` })}
                </Button>
              </Link>}
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
                  {map(results, obj => (
                    <Table.Row key={`${i18nKey}.row.${obj.id}`}>
                      {selected && 
                        <Table.Col>
                          <Icon
                            className="select-icon"
                            key={`${i18nKey}.selected.${obj.id}`}
                            onClick={() => this.handleSelect(obj)}
                            name={obj.selected ? 'check-circle' : 'circle'}
                          />
                      </Table.Col>}
                      {map(columns.payload, column => <Table.Col key={`${i18nKey}.col.${obj.id}.${column.key}`}>
                        <TableCol
                          column={column}
                          handleActive={() => this.handleActive(obj)}
                          handleSuperuser={() => this.handleSuperuser(obj)}
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
            <Pagination
              current={offset + 1}
              last={ceil(pagination.total / pagination.limit)}
              onClick={this.handleOffset}
            />
          </Fragment>
      );
  };
};

TableList.propTypes = propTypes;
TableList.defaultProps = defaultProps;

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
  )(TableList));
