import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

const i18nComponentKey = 'app.promociones.index';
const propTypes = {};
const defaultProps = {};


const Promociones = (props) => (
  <h2>Promociones</h2>
);

Promociones.propTypes = propTypes;
Promociones.defaultProps = defaultProps;

export default injectIntl(
  connect(
    // mapStateToProps
    state => ({}),
    // mapActionsToProps
    dispatch => bindActionCreators({
      //functName,
    }, dispatch),
  )(Promociones));
