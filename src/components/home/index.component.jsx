import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import C3Chart from 'react-c3js';
import {
  Card,
  Grid,
  Header,
} from 'tabler-react';

import 'c3/c3.css';

import config from './duck/config';

const i18nComponentKey = 'app.home.index';
const propTypes = {};
const defaultProps = {};

const data = {
  columns: [
    ['data1', 30, 200, 100, 400, 150, 250],
    ['data2', 50, 20, 10, 40, 15, 25]
  ]
};

const Home = (props) => (
  <Card>
    <Card.Header>
      <Header.H3>{props.intl.formatMessage({ id: `${i18nComponentKey}.title`, defaultMessage: `${i18nComponentKey}.title` })}</Header.H3>
    </Card.Header>
    <Card.Body>
      <Grid.Row cards deck>
        <Grid.Col md={4}>
          <Card body={<C3Chart data={{ columns: [ ['data1', 75], ['data2', 42] ], type: 'pie' }} element="testchart" />} />
        </Grid.Col>
        <Grid.Col md={4}>
          <Card
            body={`Extra long content of card. Lorem ipsum dolor sit amet,
        consetetur sadipscing elitr`}
          />
        </Grid.Col>
        <Grid.Col md={4}>
          <Card body="Short content" />
        </Grid.Col>
      </Grid.Row>
    </Card.Body>
  </Card>
);

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
