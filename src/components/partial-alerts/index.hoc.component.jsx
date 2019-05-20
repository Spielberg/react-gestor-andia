import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import config from './duck/config';

function PartialAlertsHOC(WrappedComponent) {
  const defaultState = {
    display: false,
    type: '',
    txt: '',
    cb: () => null,
  };

  class Alert extends Component {

    constructor(props) {
      super(props);
      this.state = { ...defaultState };
      this.open = this.open.bind(this);
    }

    open({ type, txt, style = config.PARTIAL_ALERTS.default_style }, cb = () => null) {
      this.setState({ display: true, type, txt, style, cb }, () => {
        setTimeout(
          () => {
            this.state.cb();
            this.setState({ ...defaultState });
          }, this.props.timeout);
      },
      );
    }

    display() {
      if (!this.state.display) {
        return null;
      }
      const className = [];
      switch (this.props.style) {
        case 'bulma':
          className.push('notification', `is-${this.state.type}`);
          break;
        case 'bootstrap':
        default:
          className.push('alert', 'alert-block', `alert-${this.state.type}`);
      }
      if (config.PARTIAL_ALERTS.include_animation) {
        className.push('animated', 'fadeIn');
      }
      return (
        <div className={className.join(' ')}>
          <span dangerouslySetInnerHTML={{ __html: this.state.txt }} />
        </div>
      );
    }

    render() {
      return (
        <Fragment>
          <WrappedComponent
            partialAlert={this}
            {...this.props}
            {...this.state}
          />
        </Fragment>
      );
    }
  }

  Alert.propTypes = {
    timeout: PropTypes.number,
    style: PropTypes.string,
  };

  Alert.defaultProps = {
    timeout: config.PARTIAL_ALERTS.timeout,
    style: config.PARTIAL_ALERTS.default_style,
  };

  return Alert;
}

export default PartialAlertsHOC;
