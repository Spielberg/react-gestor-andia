import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';

import config from './duck/config';

import {
  fetchStats,
} from './duck';

const i18nComponentKey = 'app.components.stats';
const propTypes = {
  loading: PropTypes.bool.isRequired,
  intl: intlShape.isRequired,
};
const defaultProps = {};

class Stats extends Component {

  constructor(props) {
    super(props);

    // api actions
    this.fetchStats = fetchStats.bind(this);
  }

  componentDidMount() {
    this.props.actions.displayLoading();
    this.fetchStats(this.props.report.id, (err, stats) => {
      if (err) {
        if (config.DEBUG) console.error(err);
        return this.props.partialAlert.open({
          type: 'danger',
          txt: err.message,
        });
      }
      this.props.actions.setStats(stats);
      this.props.actions.hideLoading();
    });
  }

  /**
  * component render method
  * @return {reactElement} - react element itself
  */
  render() {
    const handle = (e) => {
      e.preventDefault();
      if (this.props.loading) {
        return this.props.actions.hideLoading();
      }
      return this.props.actions.displayLoading();
    };
    return (
      <section className="section">
        <div className="container">
          {this.props.partialAlert.display()}
          <h1 className="title" onClick={handle}>
            {this.props.intl.formatMessage({ id: `${i18nComponentKey}.hello-word`, defaultMessage: 'texto por defecto' })}
          </h1>
          <p className="subtitle">
            <span onClick={e => this.props.actions.setLocale('es')}>Español</span><br />
            <span onClick={e => this.props.actions.setLocale('en')}>English</span><br />
          </p>
        </div>
      </section>
    );
  }
}

Stats.propTypes = propTypes;
Stats.defaultProps = defaultProps;

export default injectIntl(Stats);
