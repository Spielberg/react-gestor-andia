import React, { Component, Fragment } from 'react';
import { addLocaleData, IntlProvider } from 'react-intl';
import PropTypes from 'prop-types';
import { matchPath } from 'react-router';
import en from 'react-intl/locale-data/en';
import es from 'react-intl/locale-data/es';
import { each } from 'lodash';

import config from './duck/config';

import Loading from '../loading/index.component';

import {
  appSelectors,
} from './duck';

import PartialAlertsHOC from '../partial-alerts/index.hoc.component';

import Stats from '../stats/index.component';

addLocaleData([ ...en, ...es]);

const defaultProps = {
  partialAlert: PropTypes.object.isRequired,
};

const propTypes = {};

class App extends Component {
  constructor(props) {
    super(props);

    const match = matchPath(window.location.pathname, {
      path: '/:locale(en|es)?',
      exact: true,
      strict: false
    });
    
    this.state = {
      loading: false,
      locale: match.params.locale || config.I18N.default,
      report: {
        id: config.REPORT_ID,
        stats: {},
      },
    };

    // bind actions
    this.actions = {};
    each(appSelectors, (func, w) => 
      this.actions[w] = appSelectors[w].bind(this));
  }

  render() {
    return (
      <IntlProvider locale={this.state.locale} messages={config.I18N.dictionary[this.state.locale]}>
        <Fragment>
          {this.state.loading && <Loading />}
          <Stats
            actions={{...this.actions}}
            {...this.state}
            {...this.props}
          />
        </Fragment>
      </IntlProvider>
    );
  }
}

App.defaultProps = defaultProps;

App.propTypes = propTypes;

export default PartialAlertsHOC(App);
