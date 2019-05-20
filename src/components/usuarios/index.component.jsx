import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

const i18nComponentKey = 'app.usuarios.index';
const propTypes = {};
const defaultProps = {};


const Usuarios = (props) => (
  <h2>Usuarios</h2>
);

Usuarios.propTypes = propTypes;
Usuarios.defaultProps = defaultProps;

export default injectIntl(
  connect(
    // mapStateToProps
    state => ({}),
    // mapActionsToProps
    dispatch => bindActionCreators({
      //functName,
    }, dispatch),
  )(Usuarios));
