import { combineReducers } from 'redux';

import appAlertsReducer from './components/app-alerts/duck';
import appReducer from './components/app/duck';
import loadingReducer from './components/loading/duck';

const rootReducer = combineReducers({
  alerts: appAlertsReducer,
  app: appReducer,
  loading: loadingReducer,
});

export default rootReducer;
