import loadingReducer from './reducers';
import './main.scss';

export { default as loadingTypes } from './types';
export { default as loadingConfig } from './config';
export {
  displayLoading,
  hideLoading,
} from './actions/loading.actions';
export default loadingReducer;
