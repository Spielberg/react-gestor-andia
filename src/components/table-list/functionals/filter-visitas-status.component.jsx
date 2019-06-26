import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import {
  map,
} from 'lodash';
import {
  Form,
} from 'tabler-react';

import config from '../../visitas/duck/config';

const i18nComponentKey = 'app.visitas.form';
const propTypes = {
  status: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};
const defaultProps = {};

const FilterVisitasStatus = ({ intl, status, onChange }) => (
  <Form.Select
    className="input-options select-promociones"
    value={status}
    onChange={onChange}
  >
    <option />
    {map(config.VISITAS.statuses, ({ key }) => <option value={key} key={`${i18nComponentKey}-stats-${key}`}>
      {intl.formatMessage({ id: `${i18nComponentKey}.status.${key}`, defaultMessage: `${i18nComponentKey}.status.${key}` })}
    </option>)}
  </Form.Select>
);

FilterVisitasStatus.propTypes = propTypes;
FilterVisitasStatus.defaultProps = defaultProps;

export default injectIntl(FilterVisitasStatus);
