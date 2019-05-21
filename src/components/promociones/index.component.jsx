import React from 'react';

import TableList from '../table-list/index.component';

import config from './duck/config';

const propTypes = {};
const defaultProps = {};

const Promociones = (props) => <TableList {...config.PROMOCIONES.tableList} />;

Promociones.propTypes = propTypes;
Promociones.defaultProps = defaultProps;

export default Promociones;
