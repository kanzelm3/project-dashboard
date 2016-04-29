import { combineReducers } from 'redux';
import { routeReducer as router } from 'react-router-redux';
import taskReducer from './modules/task';

export default combineReducers({
  tasks: taskReducer,
  router
});
