import React from 'react';

import TableList from '../table-list/index.component';

import config from './duck/config';

const propTypes = {};
const defaultProps = {};

const Visitas = (props) => <TableList selected filterByPromocion {...config.VISITAS.tableList}  />;

Visitas.propTypes = propTypes;
Visitas.defaultProps = defaultProps;

export default Visitas;
