import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
//
import specify from './specify';
import jobDetails from './jobDetails';
import tracker from './tracker';

export default combineReducers({
  form: formReducer,
  specify,
  jobDetails,
  tracker,
});
