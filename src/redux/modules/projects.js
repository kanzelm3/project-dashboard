import { fromJS } from 'immutable';
import Action from '../action';

/**
 * Enums for action types
 * @type {Object}
 */
export const type = {
  ADD_PROJECT: 'ADD_PROJECT'
};

/**
 * Action to add data to the state
 * @param  {[data]} data The data to add
 */
export const addProject = (data) => {
  console.debug(data);
  return new Action(
    type.ADD_PROJECT,
    data
  ).toObject();
};

/**
 * Reducer for handling data actions
 * @param  {[type]} state  [description]
 * @param  {[type]} action [description]
 */
const dataReducer = (state = fromJS([]), action) => {
  switch (action.type) {

    case type.ADD_PROJECT:
      console.debug(action.payload);
      return fromJS([
        action.payload,
        ...state.projects
      ]);

    default:
      return state;
  }
};

export default dataReducer;
