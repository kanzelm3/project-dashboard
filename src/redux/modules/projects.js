import { fromJS } from 'immutable';
import Action from '../action';

/**
 * Enums for action types
 * @type {Object}
 */
export const type = {
  ADD_PROJECT: 'ADD_PROJECT',
  UPDATE_PROJECT: 'UPDATE_PROJECT'
};

export const initialProjects = [
  {
    created: 1,
    project: 'LPWS Refactor',
    begin: '03/22/2016',
    end: '04/28/2016',
    assignee: 'Paddy Fotovich',
    duration: 15,
    status: 'In Work',
    completeness: 0.90
  },
  {
    created: 2,
    project: 'End To End Sim Wrapper',
    begin: '01/01/2016',
    end: '01/15/2016',
    assignee: 'Kevin Kanzelmeyer',
    duration: 15,
    status: 'Overdue',
    completeness: 0.60
  },
  {
    created: 3,
    project: 'LPWS Phase III Mods',
    begin: '03/01/2016',
    end: '04/22/2016',
    assignee: 'Adam Redmon',
    duration: 13,
    status: 'In Work',
    completeness: 0.95
  }
];

export const getNewProject = (millis) => {
  return {
    created: millis,
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
export const addProject = (data) => {
  return new Action(
    type.ADD_PROJECT,
    data
  ).toObject();
};

export const updateProject = (data) => {
  return new Action(
    type.UPDATE_PROJECT,
    data
  ).toObject();
};

/**
 * Reducer for handling data actions
 * @param  {[type]} state  [description]
 * @param  {[type]} action [description]
 */
const projectReducer = (state = fromJS([]), action) => {
  switch (action.type) {
    case type.ADD_PROJECT:
      console.debug(action.payload);
      return state.push(fromJS(action.payload));

    case type.UPDATE_PROJECT:
      return state.merge(fromJS(action.payload));

    default:
      return state;
  }
};

export default projectReducer;
