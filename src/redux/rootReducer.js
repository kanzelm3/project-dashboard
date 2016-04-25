import { combineReducers } from 'redux';
import { routeReducer as router } from 'react-router-redux';
import projectsModule from './modules/projects';

export default combineReducers({
  projects: projectsModule,
  router
});
