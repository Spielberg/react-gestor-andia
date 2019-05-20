import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';

import App from './components/app/index';
import * as serviceWorker from './serviceWorker';

import { sessionMiddleware } from './components/session/duck';

import config from '../src/site.config';

import reducers from './reducer';

import 'tabler-react/dist/Tabler.css';
import './scss/main.scss';

const middlewares = [
  sessionMiddleware,
  thunkMiddleware,
];

const middlewareVars = [
  reducers,
];

if (config.DEBUG) {
  const logger = createLogger({
    collapsed: (getState, action, logEntry) => (
      action.payload !== undefined && action.payload.expand !== undefined ?
        !action.payload.expand :
        !logEntry.error
    ),
  });
  middlewares.push(logger);
}

const createStoreWithMiddleware = applyMiddleware(...middlewares)(createStore);
ReactDOM.render(<Provider store={createStoreWithMiddleware(...middlewareVars)}>
  <App />
</Provider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
