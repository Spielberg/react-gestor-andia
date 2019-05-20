import axios from 'axios';
import {
  isNull,
  isUndefined,
  template,
} from 'lodash';

import config from '../config';

const i18nComponentKey = 'app.account-details.duck.actions.fetch-account';

export function fetchStats(reportId, cb = () => (null)) {
  if (isUndefined(reportId) || isNull(reportId)) {
    const message = this.props.intl.formatMessage({
      id: `${i18nComponentKey}.required-err`,
      defaultMessage: 'Report id, you must include an id in the query parameters',
    });
    return cb(new Error(message));
  }
  const url = template(config.API.stats.get)({ reportId });
  if (config.DEBUG) console.log(`fetchStats URL:${url}`);
  return axios.get(url)
    .then((response) => {
      if (response.status !== 200) {
        return cb(new Error(`Status erros in fetchStats expected 200 received ${response.status}`));
      }
      return cb(null, response.data);
    })
    .catch((error) => {
      return cb(error);
    });
}
