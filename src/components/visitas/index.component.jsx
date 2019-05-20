import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  Page,
} from 'tabler-react';

import Header from '../header/index.component';

const i18nComponentKey = 'app.visitas.index';
const propTypes = {};
const defaultProps = {};


const Visitas = (props) => (
  <Page.Header>
    <h2>Visitas</h2>
  </Page.Header>
);

Visitas.propTypes = propTypes;
Visitas.defaultProps = defaultProps;

export default injectIntl(
  connect(
    // mapStateToProps
    state => ({}),
    // mapActionsToProps
    dispatch => bindActionCreators({
      //functName,
    }, dispatch),
  )(Visitas));
