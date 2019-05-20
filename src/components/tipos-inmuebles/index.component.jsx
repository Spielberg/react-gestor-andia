import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

const i18nComponentKey = 'app.tipos-inmuebles.index';
const propTypes = {};
const defaultProps = {};


const TiposInmuebles = (props) => (
  <h2>TiposInmuebles</h2>
);

TiposInmuebles.propTypes = propTypes;
TiposInmuebles.defaultProps = defaultProps;

export default injectIntl(
  connect(
    // mapStateToProps
    state => ({}),
    // mapActionsToProps
    dispatch => bindActionCreators({
      //functName,
    }, dispatch),
  )(TiposInmuebles));
