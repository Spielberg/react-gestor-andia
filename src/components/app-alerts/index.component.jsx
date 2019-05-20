import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import config from './duck/config';

import {
  removeAppAlert,
} from './duck';

const propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  txt: PropTypes.string.isRequired,
  timeout: PropTypes.number,
  style: PropTypes.string,
};
const defaultProps = {
  timeout: config.APP_ALERTS.timeout,
  style: config.APP_ALERTS.default_style,
};

class AppAlert extends Component {
  /**
  * class constructor
  * @param {obj} props - Component properties
  * @return {void}
  */
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    setTimeout(() => {
      this.props.removeAppAlert(this.props.id);
    }, this.props.timeout);
  }

  /**
  * component render method
  * @return {reactElement} - react element itself
  */
  render() {
    const { style, type, txt } = this.props;
    const className = [];
    switch (style) {
      case 'bulma':
        className.push('notification', `is-${type}`);
        break;
      case 'bootstrap':
      default:
        className.push('alert', 'alert-block', `alert-${type}`);
    }
    return (
      <div className={className.join(' ')}>
        <span dangerouslySetInnerHTML={{ __html: txt }} />
      </div>
    );
  }
}

AppAlert.propTypes = propTypes;
AppAlert.defaultProps = defaultProps;

export default injectIntl(
  connect(
    // mapStateToProps
    state => ({}),
    // mapActionsToProps
    dispatch => bindActionCreators({
      removeAppAlert,
    }, dispatch),
  )(AppAlert));
