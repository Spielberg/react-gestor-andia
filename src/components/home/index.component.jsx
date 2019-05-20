import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  Page,
} from 'tabler-react';

import config from './duck/config';

const i18nComponentKey = 'app.home.index';
const propTypes = {};
const defaultProps = {};

const Home = (props) => (
  <Page.Header>
    <h1>Home</h1>
  </Page.Header>
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
