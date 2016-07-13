import { Map } from 'immutable';
import moment from 'moment';
/**
 * Enums for action types
 * @type {Object}
 */
const ADD_TASK = 'ADD_TASK';
const UPDATE_TASK = 'UPDATE_TASK';
const DELETE_TASK = 'DELETE_TASK';

export const initialTasks = [
  {
    id: 101,
    name: 'LPWS Remodel',
    begin: '03/22/2016',
    end: '04/28/2016',
    assignee: 'Paddy Fotovich',
    duration: 10,
    status: 'In Work',
    completeness: 0.90
  },
  {
    id: 102,
    name: 'ETESIM Wrapper',
    begin: '01/01/2016',
    end: '01/15/2016',
    assignee: 'Kevin Kanzelmeyer',
    duration: 15,
    status: 'Overdue',
    completeness: 0.60
  },
  {
    id: 103,
    name: 'Q53 etesim integration',
    begin: '03/01/2016',
    end: '04/22/2016',
    assignee: 'Jan Lessmann',
    duration: 5,
    status: 'In Work',
    completeness: 0.95
  }
];

export const getNewTask = () => {
  const millis = moment().valueOf();
  const duration = 1;
  const now = moment();
  const nowString = now.format('MM/DD/YYYY');
  const tomorrow = now.add(duration, 'd');
  const tomorrowString = tomorrow.format('MM/DD/YYYY');
  return {
    id: millis,
    name: 'New Task',
    begin: nowString,
    end: tomorrowString,
    assignee: 'Unassigned',
    duration,
    status: 'New',
    completeness: 0.0
  };
};

/**
 * Action to add data to the state
 * @param  {[data]} data The data to add
 */
export const addTask = (task) => {
  return ({
    type: ADD_TASK,
    payload: {
      task
    }
  });
};

export const updateTask = (task) => ({
  type: UPDATE_TASK,
  payload: {
    task
  }
});

export const deleteTask = (task) => ({
  type: DELETE_TASK,
  payload: {
    task
  }
});

const addTaskHandler = (state, { payload: { task } }) => {
  return state.set(task.get('id'), task);
};

const updateTaskHandler = (state, { payload: { task } }) => {
  return state.set(task.get('id'), task);
};

const deleteTaskHandler = (state, { payload: { task } }) => {
  return state.delete(task.get('id'));
};
/**
 * Reducer for handling data actions
 * @param  {[type]} state  [description]
 * @param  {[type]} action [description]
 */
const taskReducer = (state = Map(), action) => {
  switch (action.type) {
    case ADD_TASK:
      return addTaskHandler(state, action);

    case UPDATE_TASK:
      return updateTaskHandler(state, action);

    case DELETE_TASK:
      return deleteTaskHandler(state, action);

    default:
      return state;
  }
};

export default taskReducer;
