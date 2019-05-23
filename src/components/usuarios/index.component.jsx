import React from 'react';

import TableList from '../table-list/index.component';

import config from './duck/config';

const propTypes = {};
const defaultProps = {};

const Usuarios = (props) => <TableList {...config.USUARIOS.tableList} />;

Usuarios.propTypes = propTypes;
Usuarios.defaultProps = defaultProps;

export default Usuarios;
