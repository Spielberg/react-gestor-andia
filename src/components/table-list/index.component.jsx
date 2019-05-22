import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { intlShape, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import {
  Badge,
  Button,
  Card,
  Dimmer,
  Form,
  Header,
  Table,
} from 'tabler-react';

import {
  ceil,
  each,
  map,
} from 'lodash';

import {
  tableListSelectors,
} from './duck';

import config from './duck/config';

import Pagination from '../../mixins/pagination.component';

const i18nComponentKey = 'app.table-list.index';

const propTypes = {
  intl: intlShape.isRequired,
  url: PropTypes.string.isRequired,
  session: PropTypes.object.isRequired,
  columns: PropTypes.object.isRequired,
  addUrl: PropTypes.string,
  editUrl: PropTypes.string,
  i18nKey: PropTypes.string,
};

const defaultProps = {
  i18nKey: i18nComponentKey,
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
    const { addUrl, editUrl, intl, columns, i18nKey } = this.props;
    const { loading, offset, results, pagination, query } = this.state;
    const boolean = (obj, column) => {
      const { src, key, i18n } = column;
      const value = src(obj, key);
      return <Badge color={`${value ? 'success' : 'danger'}`} className="mr-1">
              <span onClick={key === 'active' ? () => this.handleActive(obj) : () => null}>
                {value
                  ? intl.formatMessage({ id: `${i18nKey}.column.${i18n(column)}.true`, defaultMessage: `${i18nKey}.column.${i18n(column)}.true` })
                  : intl.formatMessage({ id: `${i18nKey}.column.${i18n(column)}.false`, defaultMessage: `${i18nKey}.column.${i18n(column)}.false` })
                }
              </span>
            </Badge>
        };

    return (
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
            <Link to={addUrl} className="btn-add">
              <Button color="primary">{intl.formatMessage({ id: `${i18nKey}.nuevo`, defaultMessage: `${i18nKey}.nuevo` })}</Button>
            </Link>
          </Card.Options>
        </Card.Header>
        <Dimmer active={loading} loader className="table-container">
          <Table>
            <Table.Header>
              {map(columns.payload, column => (
                <Table.ColHeader key={`${i18nKey}.col-header.${column.key}`}>
                  {intl.formatMessage({ id: `${i18nKey}.column.${column.i18n(column)}`, defaultMessage: `${i18nKey}.column.${column.i18n(column)}` })}
                </Table.ColHeader>
              ))}
              <Table.ColHeader>{intl.formatMessage({ id: `${i18nComponentKey}.column.actions`, defaultMessage: `${i18nComponentKey}.column.actions` })}</Table.ColHeader>
            </Table.Header>
              <Table.Body>
                {map(results, obj => (
                  <Table.Row key={`${i18nKey}.row.${obj.id}`}>
                    {map(columns.payload, column => <Table.Col key={`${i18nKey}.col.${obj.id}.${column.key}`}>
                    {column.type === 'boolean'
                      ? boolean(obj, column)
                      : column.src(obj, column.key)
                    }</Table.Col>)}
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
        </Dimmer>
      </Card>
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
