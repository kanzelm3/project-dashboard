import { Map } from 'immutable';
/**
 * Enums for action types
 * @type {Object}
 */
const SET_DATA = 'SET_DATA';

/**
 * Action to add data to the state
 * @param  {[data]} data The data to add
 */
export const setData = (data) => {
  return ({
    type: SET_DATA,
    payload: {
      data
    }
  });
};

const setDataHandler = (state, { payload: { data } }) => {
  return state.set('mouse', data);
};
/**
 * Reducer for handling data actions
 * @param  {[type]} state  [description]
 * @param  {[type]} action [description]
 */
const taskReducer = (state = Map(), action) => {
  switch (action.type) {
    case SET_DATA:
      return setDataHandler(state, action);

    default:
      return state;
  }
};

export default taskReducer;
