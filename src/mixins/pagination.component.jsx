import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import {
  isUndefined,
  isNull,
} from 'lodash';

const i18nComponentKey = 'app.accounts-list.pagination';

const propTypes = {
  intl: intlShape.isRequired,
  current: PropTypes.number.isRequired,
  last: PropTypes.number.isRequired,
  onClick: PropTypes.func,
  delta: PropTypes.number,
  name: PropTypes.string,
};
const defaultProps = {
  onClick: val => console.log(val),
  delta: 2,
  name: i18nComponentKey,
};

const Pagination = ({ intl, onClick, current, delta, last, name }) => {
  if (isUndefined(last) || last === 1) {
    return null;
  }

  const get = () => {
    const range = [];
    const rangeWithDots = [];
    let l;

    range.push(1);
    for (let i = current - delta; i <= current + delta; i++) {
      if (i < last && i > 1) {
        range.push(i);
      }
    }
    if (last !== 1) range.push(last);
    for (const i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push({ value: l + 1, txt: l + 1, className: ['page-link', 'pointer'] });
        } else if (i - l !== 1) {
          rangeWithDots.push({ txt: '&hellip;', className: ['pagination-ellipsis', 'page-link'] });
        }
      }
      rangeWithDots.push({ value: i, txt: i, className: ['page-link', 'pointer'] });
      l = i;
    }

    return rangeWithDots;
  };

  const range = get();
  return (
    <Fragment>
      <nav role="navigation" aria-label="pagination">
        <ul className="pagination">
          <li class={`page-item ${current === 1 ? 'disabled' : ''}`}>
            <span className="page-link pointer" onClick={() => onClick(current - 2)}>{intl.formatMessage({ id: `${i18nComponentKey}.previous`, defaultMessage: `${i18nComponentKey}.previous` })}</span>
          </li>
          {range.map((row, i) => {
            const { txt, className, value = null } = row;
            const enabled = !isNull(value);
            const aClass = className;
            const key = enabled ? `pagination-${name}-${className}-value-${value}` : `pagination-${name}-${className}-index-${i}`;
            const isCurrent = value === current;
            if (isCurrent) {
              aClass.push('active');
            }
            return enabled ? (
              <li className={`page-item ${isCurrent ? 'active' : ''}`} key={key}>
                <span
                  className={aClass ? aClass.join(' ') : ''}
                  onClick={() => onClick(value - 1)}
                  aria-label={isCurrent ?
                    intl.formatMessage({ id: `${i18nComponentKey}.goto-page`, defaultMessage: 'Goto page {value, number}' }, { value }) :
                    intl.formatMessage({ id: `${i18nComponentKey}.page`, defaultMessage: 'Page {value, number}' }, { value })}
                  aria-current={isCurrent ? 'page' : false}
                >{txt}</span>
              </li>
            ) : (
              <li className="page-item disabled" key={key}>
                <span className={className.join(' ')} dangerouslySetInnerHTML={{ __html: txt }} />
              </li>
              );
          })}
          <li class={`page-item ${current === last ? 'disabled' : ''}`}>
            <span className="page-link pointer" onClick={() => onClick(current)}>{intl.formatMessage({ id: `${i18nComponentKey}.next-page`, defaultMessage: `${i18nComponentKey}.next-page` })}</span>
          </li>
        </ul>
      </nav>
    </Fragment>
  );
};

Pagination.propTypes = propTypes;
Pagination.defaultProps = defaultProps;

export default injectIntl(Pagination);
