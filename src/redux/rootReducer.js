import { combineReducers } from 'redux';
import { routeReducer as router } from 'react-router-redux';
import projectReducer from './modules/projects';

export default combineReducers({
  projects: projectReducer,
  router
});
