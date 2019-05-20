import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import _ from 'lodash';

const i18nComponentKey = 'app.accounts-list.pagination';

const propTypes = {
  intl: PropTypes.object.isRequired,
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

const PaginationBulma = ({ intl, onClick, current, delta, last, name }) => {
  if (_.isUndefined(last) || last === 1) {
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
          rangeWithDots.push({ value: l + 1, txt: l + 1, className: ['pagination-link', 'pointer'] });
        } else if (i - l !== 1) {
          rangeWithDots.push({ txt: '&hellip;', className: ['pagination-ellipsis'] });
        }
      }
      rangeWithDots.push({ value: i, txt: i, className: ['pagination-link', 'pointer'] });
      l = i;
    }

    return rangeWithDots;
  };

  const range = get();
  return (
    <Fragment>
      <nav className="pagination" role="navigation" aria-label="pagination">
        {current !== 1 && <span className="pagination-previous pointer" onClick={() => onClick(current - 1)}>{intl.formatMessage({ id: `${i18nComponentKey}.previous`, defaultMessage: 'Previous' })}</span>}
        {current !== last && <span className="pagination-next pointer" onClick={() => onClick(current + 1)}>{intl.formatMessage({ id: `${i18nComponentKey}.next-page`, defaultMessage: 'Next page' })}</span>}
        <ul className="pagination-list">
          {range.map((row, i) => {
            const { txt, className, value = null } = row;
            const enabled = !_.isNull(value);
            const aClass = className;
            const key = enabled ? `pagination-${name}-${className}-value-${value}` : `pagination-${name}-${className}-index-${i}`;
            const isCurrent = value === current;
            if (isCurrent) {
              aClass.push('is-current');
            }
            return enabled ? (
              <li key={key}>
                <span
                  className={aClass ? aClass.join(' ') : ''}
                  onClick={() => onClick(value)}
                  aria-label={isCurrent ?
                    intl.formatMessage({ id: `${i18nComponentKey}.goto-page`, defaultMessage: 'Goto page {value, number}' }, { value }) :
                    intl.formatMessage({ id: `${i18nComponentKey}.page`, defaultMessage: 'Page {value, number}' }, { value })}
                  aria-current={isCurrent ? 'page' : false}
                >{txt}</span>
              </li>
            ) : (
              <li key={key}>
                <span className={className.join(' ')} dangerouslySetInnerHTML={{ __html: txt }} />
              </li>
              );
          })}
        </ul>
      </nav>
    </Fragment>
  );
};

PaginationBulma.propTypes = propTypes;
PaginationBulma.defaultProps = defaultProps;

export default injectIntl(
  connect(
    // mapStateToProps
    state => ({
      //locale: state.i18n.locale,
    }),
  )(PaginationBulma));
