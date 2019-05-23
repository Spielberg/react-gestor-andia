import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import {
  Badge,
  Icon,
} from 'tabler-react';

const i18nComponentKey = 'app.table-list.index';
const propTypes = {
  intl: intlShape.isRequired,
};
const defaultProps = {};

const TableCol = (props) => {
  const { i18nKey, column, column: { src, key, i18n }, intl, obj } = props;
  const value = src(obj, key);
  if (props.column.type === 'boolean') {
    const coverage = (child) => (
      <Badge color={`${value ? 'success' : 'danger'}`} className="mr-1">
        <span onClick={key === 'active' ? props.handleActive : () => null}>
          {child}
        </span>
      </Badge>
    );
    if (key === 'superuser') {
      return (
        <span>
          <Icon name="award" className={`${value ? 'success' : 'danger'}`} onClick={props.handleSuperuser} />
        </span>
      );  
    }
    return coverage(
          value
            ? intl.formatMessage({ id: `${i18nKey}.column.${i18n(column)}.true`, defaultMessage: `${i18nKey}.column.${i18n(column)}.true` })
            : intl.formatMessage({ id: `${i18nKey}.column.${i18n(column)}.false`, defaultMessage: `${i18nKey}.column.${i18n(column)}.false` })
          );
  }
  return column.src(obj, column.key);
}

TableCol.propTypes = propTypes;
TableCol.defaultProps = defaultProps;

export default injectIntl(TableCol)
