import { fromJS } from 'immutable';
import Action from '../action';

/**
 * Enums for action types
 * @type {Object}
 */
export const type = {
  ADD_PROJECT: 'ADD_PROJECT',
  SORT_ASC: 'SORT_ASC',
  SORT_DES: 'SORT_DES'
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

export const sortAscending = (field) => {
  return new Action(
    type.SORT_ASC,
    field
  ).toObject();
};

export const sortDescending = (field) => {
  return new Action(
    type.SORT_DES,
    field
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
      return state.push(fromJS(action.payload));

    case type.SORT_ASC:
      return state.sortBy(
        (val, key) => val.get(action.payload));

    case type.SORT_DES:
      return state.sortBy(
        (val, key) => -val.get(action.payload));

    default:
      return state;
  }
};

export default projectReducer;
