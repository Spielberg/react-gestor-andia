import React, { Component } from 'react';
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
import {
  each,
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
      stats: {
        comerciales: [],
        promociones: [],
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
        </Card.Header>
        <Card.Body>
          <Grid.Row cards deck>
            <Grid.Col md={4}>
              <Card>
                <Card.Header>{this.props.intl.formatMessage({ id: `${i18nComponentKey}.header.stats.promociones`, defaultMessage: `${i18nComponentKey}.header.stats.promociones` })}</Card.Header>
                <C3Chart data={{ columns: this.state.stats.promociones, type: 'pie' }} element="testchart" />
              </Card>
            </Grid.Col>
            <Grid.Col md={4}>
              <Card
                body={`Extra long content of card. Lorem ipsum dolor sit amet,
          consetetur sadipscing elitr`}
              />
            </Grid.Col>
            <Grid.Col md={4}>
              <Card.Header>{this.props.intl.formatMessage({ id: `${i18nComponentKey}.header.stats.comerciales`, defaultMessage: `${i18nComponentKey}.header.stats.comerciales` })}</Card.Header>
              <C3Chart data={{ columns: this.state.stats.comerciales, type: 'pie' }} element="testchart" />
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
