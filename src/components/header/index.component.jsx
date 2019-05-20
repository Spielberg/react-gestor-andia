import React, { Fragment } from 'react';
import { injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import {
  Container,
  Nav,
  Site,
} from 'tabler-react';

import config from './duck/config';

const i18nComponentKey = 'app.home.index';
const propTypes = {};
const defaultProps = {};

const CustomItem = (props) => {
  const { active = false, className = 'nav-link', to, icon, value } = props;
  const arrClassName = [className];
  if (active) {
    arrClassName.push('active');
  }
  return (
    <li className="nav-item">
      <Link to={to} className={`${arrClassName.join(' ')}`}>
        {icon && <i className={`fe fe-${icon}`} />}{value}
      </Link>
    </li>
  );
}

const Header = (props) => {
  console.log(window.location);
  const { match = {}, intl, children } = props;
  return (
    <Fragment>
      <Site.Header>
        <Link to={config.PATHS.homepage} className="header-brand">
          <img
            alt={intl.formatMessage({ id: `${i18nComponentKey}.logotipo`, defaultMessage: `${i18nComponentKey}.logotipo` })}
            src={`${config.STATIC_CONTENT_URL}/images/logo.png`}
          /> 
        </Link>
      </Site.Header>
      <Site.Nav>
        <Nav>
          <CustomItem to={config.PATHS.visitas} icon="book" value="Visitas" active={config.PATHS.visitas === match.path} />
          <Nav.Item hasSubNav value="Configuración" icon="settings" active={/^\/configuracion/.test(match.path)}>
            <CustomItem to={config.PATHS.configuracion.usuarios} value="Usuarios" icon="user" className="dropdown-item" />
            <CustomItem to={config.PATHS.configuracion.promociones} value="Promociones" icon="home" className="dropdown-item" />
            <CustomItem to={config.PATHS.configuracion.tiposInmuebles} value="Tipos de inmuebles" icon="settings" className="dropdown-item" />
          </Nav.Item>
        </Nav>
      </Site.Nav>
      <Container>
        {children}
      </Container>
    </Fragment>
  );
}

Header.propTypes = propTypes;
Header.defaultProps = defaultProps;

export default injectIntl(Header);