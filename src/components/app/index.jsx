import React, { Fragment } from 'react';
import { addLocaleData, IntlProvider } from 'react-intl';
import { connect } from 'react-redux';
import { BrowserRouter, HashRouter, Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import es from 'react-intl/locale-data/es';

import config from './duck/config';

import Loading from '../loading/index.component';

const propTypes = {
  app: PropTypes.object.isRequired,
  loading: PropTypes.bool,
};

const defaultProps = {
  loading: false,
};

addLocaleData([ ...es]);

const App = (props) => {
  const { app: { i18n } } = props;
  const provider = (child) => config.HASH_ROUTER ? <HashRouter>{child}</HashRouter> : <BrowserRouter>{child}</BrowserRouter>;
  const coverage = (child) => (
    <IntlProvider locale={i18n.locale} messages={i18n.messages[i18n.locale]}>
      <Fragment>
        {props.loading && <Loading color="#DB2120" />}
        {child}
      </Fragment>
    </IntlProvider>
  );

  if (props.session.authenticated) {
    return coverage(
      provider(
        <Login />
      )
    );
  }
  /*
  return coverage(
    provider(
      <Fragment>
        <Switch>
          <Route
            path={config.PATHS.form}
            component={Form}
          />
          <Route
            component={Home}
          />
        </Switch>
      </Fragment>,
    )
  );
  */
};

App.propTypes = propTypes;
App.defaultProps = defaultProps;

export default connect(
    state => ({
      loading: state.loading.display,
      app: state.app,
      session: state.session,
    }),
  )(App);
