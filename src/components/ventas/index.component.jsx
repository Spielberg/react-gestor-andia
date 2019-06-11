import React from 'react';

import TableList from '../table-list/index.component';

import config from './duck/config';

const propTypes = {};
const defaultProps = {};

const Ventas = (props) => <TableList {...config.VENTAS.tableList}  />;

Ventas.propTypes = propTypes;
Ventas.defaultProps = defaultProps;

export default Ventas;
