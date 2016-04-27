import { fromJS, Map } from 'immutable';
import moment from 'moment';
/**
 * Enums for action types
 * @type {Object}
 */
const ADD_PROJECT = 'ADD_PROJECT';
const UPDATE_PROJECT = 'UPDATE_PROJECT';

export const initialProjects = [
  {
    id: 101,
    project: 'A',
    begin: '03/22/2016',
    end: '04/28/2016',
    assignee: 'Paddy Fotovich',
    duration: 10,
    status: 'In Work',
    completeness: 0.90
  },
  {
    id: 102,
    project: 'B',
    begin: '01/01/2016',
    end: '01/15/2016',
    assignee: 'Kevin Kanzelmeyer',
    duration: 15,
    status: 'Overdue',
    completeness: 0.60
  },
  {
    id: 103,
    project: 'C',
    begin: '03/01/2016',
    end: '04/22/2016',
    assignee: 'Adam Redmon',
    duration: 5,
    status: 'In Work',
    completeness: 0.95
  }
];

export const getNewProject = () => {
  const millis = moment().valueOf();
  return {
    id: millis,
    project: 'New Project',
    begin: '01/01/2016',
    end: '01/01/2016',
    assignee: 'Unassigned',
    duration: 0,
    status: 'In Work',
    completeness: 0.0
  };
};

/**
 * Action to add data to the state
 * @param  {[data]} data The data to add
 */
export const addProject = (project) => {
  return ({
    type: ADD_PROJECT,
    payload: {
      project
    }
  });
};

export const updateProject = (project) => ({
  type: UPDATE_PROJECT,
  payload: {
    project
  }
});

const addProjectHandler = (state, { payload: { project } }) => {
  return state.set(project.id, fromJS(project));
};

const updateProjectHandler = (state, { payload: { project } }) => {
  return state.set(project.get('id'), project);
};
/**
 * Reducer for handling data actions
 * @param  {[type]} state  [description]
 * @param  {[type]} action [description]
 */
const projectReducer = (state = Map(), action) => {
  switch (action.type) {
    case ADD_PROJECT:
      return addProjectHandler(state, action);

    case UPDATE_PROJECT:
      return updateProjectHandler(state, action);

    default:
      return state;
  }
};

export default projectReducer;
