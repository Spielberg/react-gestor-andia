import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';

import './duck';

import config from './duck/config';

const propTypes = {
  color: PropTypes.string,
};

const defaultProps = {
  color: config.LOADING.COLOR,
};

const Loading = ({ color }) => (
  <div id="loading">
    <div id="loading-center">
      <div id="loading-center-absolute">
        <figure className="fa-5x" style={{ color }}>
          <FontAwesomeIcon icon={faCircleNotch} spin />
        </figure>
      </div>
    </div>
  </div>
);

Loading.propTypes = propTypes;

Loading.defaultProps = defaultProps;

export default Loading;
