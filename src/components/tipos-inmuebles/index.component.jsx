import React from 'react';

import TableList from '../table-list/index.component';

import config from './duck/config';

const propTypes = {};
const defaultProps = {};

const TiposInmuebles = (props) => <TableList {...config.TIPOS_INMUEBLE.tableList} />;

TiposInmuebles.propTypes = propTypes;
TiposInmuebles.defaultProps = defaultProps;

export default TiposInmuebles;