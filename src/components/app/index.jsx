import React, { Fragment } from 'react';
import { addLocaleData, IntlProvider } from 'react-intl';
import { connect } from 'react-redux';
import { BrowserRouter, HashRouter, Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import es from 'react-intl/locale-data/es';
import {
  Page,
  Site,
} from 'tabler-react';

import config from './duck/config';

import Header from '../header/index.component';
import Home from '../home/index.component';
import Loading from '../loading/index.component';
import Login from '../login/index.component';
import Promociones from '../promociones/index.component';
import PromocionesForm from '../promociones/form.component';
import TiposInmuebles from '../tipos-inmuebles/index.component';
import Usuarios from '../usuarios/index.component';
import UsuariosForm from '../usuarios/form.component';
import Visitas from '../visitas/index.component';
import VisitasForm from '../visitas/form.component';

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

  if (!props.session.authenticated) {
    return coverage(
      provider(
        <Login />
      )
    );
  }

  return coverage(
    provider(
      <Fragment>
        <Header />
        <Page.Content>
          <Switch>

            {/* visitas */}
            <Route path={config.PATHS.visitas_anadir} component={VisitasForm} />
            <Route path={config.PATHS.visitas_editar} component={VisitasForm} />
            <Route path={config.PATHS.visitas} component={Visitas} />

            {/* usuarios */}
            <Route path={config.PATHS.configuracion.usuarios_anadir} component={UsuariosForm} />
            <Route path={config.PATHS.configuracion.usuarios_editar} component={UsuariosForm} />
            <Route path={config.PATHS.configuracion.usuarios} component={Usuarios} />

            {/* promociones */}
            <Route path={config.PATHS.configuracion.promociones_anadir} component={PromocionesForm} />
            <Route path={config.PATHS.configuracion.promociones_editar} component={PromocionesForm} />
            <Route path={config.PATHS.configuracion.promociones} component={Promociones} />
            
            {/* tipos de inmuebles */}
            <Route path={config.PATHS.configuracion.tiposInmuebles} component={TiposInmuebles} />
            <Route component={Home} />
          </Switch>
        </Page.Content>
        <Site.Footer copyright={config.SITE.copyright} />

      </Fragment>,
    )
  );
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
