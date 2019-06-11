import React, { Fragment, useState } from 'react';
import { injectIntl, intlShape } from 'react-intl';
import { NavLink, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  Card,
  Button,
  Icon,
  Nav,
  Site,
} from 'tabler-react';

import config from './duck/config';

import {
  requestLogout,
} from '../session/duck/actions/login.actions';

const i18nComponentKey = 'app.home.index';
const propTypes = {
  intl: intlShape.isRequired,
};
const defaultProps = {};

const CustomItem = (props) => {
  const { className = 'nav-link', to, icon, value } = props;
  const arrClassName = [className];
  return (
    <li className="nav-item">
      <NavLink to={to} className={`${arrClassName.join(' ')}`} activeClassName="active">
        {icon && <i className={`fe fe-${icon}`} />}{value}
      </NavLink>
    </li>
  );
}

const Header = (props) => {
  const { intl } = props;
  const [visible, setVisible] = useState(false);
  const CollapseNav = () => (
    <div className={`header d-lg-flex p-0 ${visible ? '' : 'collapse'}`}>
      <div className="container">
        <div className="row row align-items-center">
          <div className="col-lg-1 ml-auto" />
          <div className="col col-lg order-lg-first">
          <Nav>
            <CustomItem to={config.PATHS.visitas} value={intl.formatMessage({ id: `${i18nComponentKey}.visitas`, defaultMessage: `${i18nComponentKey}.visitas` })} icon="book" activeClassName="active" />
            <CustomItem to={config.PATHS.ventas} value={intl.formatMessage({ id: `${i18nComponentKey}.ventas`, defaultMessage: `${i18nComponentKey}.ventas` })} icon="trending-up" activeClassName="active" />
            <CustomItem to={config.PATHS.configuracion.usuarios} value={intl.formatMessage({ id: `${i18nComponentKey}.usuarios`, defaultMessage: `${i18nComponentKey}.usuarios` })} icon="user" />
            <CustomItem to={config.PATHS.configuracion.promociones} value={intl.formatMessage({ id: `${i18nComponentKey}.promociones`, defaultMessage: `${i18nComponentKey}.promociones` })} icon="home" />
            <CustomItem to={config.PATHS.configuracion.tiposInmuebles} value={intl.formatMessage({ id: `${i18nComponentKey}.tipos-inmuebles`, defaultMessage: `${i18nComponentKey}.tipos-inmuebles` })} icon="settings" />
            <li className="nav-item logout">
              <a className="nav-link" onClick={props.requestLogout}>
                <i className="fe fe-external-link" />{intl.formatMessage({ id: `${i18nComponentKey}.salir`, defaultMessage: `${i18nComponentKey}.salir` })}
              </a>
            </li>
          </Nav>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Fragment>
      <Site.Header>
        <Link to={config.PATHS.homepage} className="header-brand">
          <img
            alt={intl.formatMessage({ id: `${i18nComponentKey}.logotipo`, defaultMessage: `${i18nComponentKey}.logotipo` })}
            src={`${config.STATIC_CONTENT_URL}/images/logo.png`}
          />
        </Link>      
        <Card.Options>
          <Button color="gray" className="logout-btn" size="sm" onClick={props.requestLogout}>{intl.formatMessage({ id: `${i18nComponentKey}.logout`, defaultMessage: `${i18nComponentKey}.logout` })}</Button>
          <Icon name="menu" className="open-menu" onClick={() => setVisible(!visible)} />
        </Card.Options>
      </Site.Header>
      <CollapseNav />
    </Fragment>
  );
}

Header.propTypes = propTypes;
Header.defaultProps = defaultProps;

export default injectIntl(
  connect(
    // mapStateToProps
    state => ({}),
    // mapActionsToProps
    dispatch => bindActionCreators({
      requestLogout,
    }, dispatch),
  )(Header));
