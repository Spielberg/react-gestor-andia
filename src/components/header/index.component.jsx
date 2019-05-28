import React, { Fragment } from 'react';
import { injectIntl, intlShape } from 'react-intl';
import { NavLink, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  Card,
  Button,
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
  const NavItems = () => (
    <Nav>
      <CustomItem to={config.PATHS.visitas} icon="book" value="Visitas" activeClassName="active" />
        <Nav.Item hasSubNav value="Configuración" icon="settings">
          <CustomItem to={config.PATHS.configuracion.usuarios} value="Usuarios" icon="user" className="dropdown-item" />
          <CustomItem to={config.PATHS.configuracion.promociones} value="Promociones" icon="home" className="dropdown-item" />
          <CustomItem to={config.PATHS.configuracion.tiposInmuebles} value="Tipos de inmuebles" icon="settings" className="dropdown-item" />
        </Nav.Item>
    </Nav>
  );
  return (
    <Fragment>
      <Site.Header onMenuToggleClick={<NavItems />}>
        <Link to={config.PATHS.homepage} className="header-brand">
          <img
            alt={intl.formatMessage({ id: `${i18nComponentKey}.logotipo`, defaultMessage: `${i18nComponentKey}.logotipo` })}
            src={`${config.STATIC_CONTENT_URL}/images/logo.png`}
          />
        </Link>      
        <Card.Options>
          <Button color="gray" size="sm" onClick={props.requestLogout}>{intl.formatMessage({ id: `${i18nComponentKey}.logout`, defaultMessage: `${i18nComponentKey}.logout` })}</Button>
        </Card.Options>
      </Site.Header>
      <Site.Nav>
        <NavItems />
      </Site.Nav>
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
