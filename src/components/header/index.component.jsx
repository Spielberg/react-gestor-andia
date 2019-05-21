import React, { Fragment } from 'react';
import { injectIntl, intlShape } from 'react-intl';
import { NavLink } from 'react-router-dom';
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
  return (
    <Fragment>
      <Site.Header>
        <Site.Logo
          alt={intl.formatMessage({ id: `${i18nComponentKey}.logotipo`, defaultMessage: `${i18nComponentKey}.logotipo` })}
          src={`${config.STATIC_CONTENT_URL}/images/logo.png`}
          href={config.PATHS.homepage}
        />
        <Card.Options>
          <Button color="gray" size="sm" onClick={props.requestLogout}>logout</Button>
        </Card.Options>
      </Site.Header>
      <Site.Nav>
        <Nav>
          <CustomItem to={config.PATHS.visitas} icon="book" value="Visitas" activeClassName="active" />
          <Nav.Item hasSubNav value="Configuración" icon="settings">
            <CustomItem to={config.PATHS.configuracion.usuarios} value="Usuarios" icon="user" className="dropdown-item" />
            <CustomItem to={config.PATHS.configuracion.promociones} value="Promociones" icon="home" className="dropdown-item" />
            <CustomItem to={config.PATHS.configuracion.tiposInmuebles} value="Tipos de inmuebles" icon="settings" className="dropdown-item" />
          </Nav.Item>
        </Nav>
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
