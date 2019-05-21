import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  Dimmer,
  Table,
  Button,
  Page,
} from 'tabler-react';

const i18nComponentKey = 'app.promociones.index';
const propTypes = {};
const defaultProps = {};


class Promociones extends Component {
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
      data: [],
    };
  }

  /**
  * component render method
  * @return {reactElement} - react element itself
  */
  render() {
    const { intl } = this.props;
    const { loading, offset, data } = this.state;

    return (
      <Page.Content>
        <Page.Header
          title={intl.formatMessage({ id: `${i18nComponentKey}.title`, defaultMessage: `${i18nComponentKey}.title` })}
        />
        <Dimmer active loader>
          <Table>
            <Table.Header>
              <Table.ColHeader>ID</Table.ColHeader>
              <Table.ColHeader>Name</Table.ColHeader>
              <Table.ColHeader>Action</Table.ColHeader>
            </Table.Header>
              <Table.Body>
                <Table.Row>
                  <Table.Col>1</Table.Col>
                  <Table.Col>Jon</Table.Col>
                  <Table.Col>
                    <Button color="primary">Edit</Button>
                  </Table.Col>
                </Table.Row>
              </Table.Body>
          </Table>
        </Dimmer>
      </Page.Content>
      );
  };
};

Promociones.propTypes = propTypes;
Promociones.defaultProps = defaultProps;

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
  )(Promociones));
