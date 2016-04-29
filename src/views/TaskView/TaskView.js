import React, { Component, PropTypes } from 'react';
import { fromJS } from 'immutable';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { addTask,
         updateTask,
         getNewTask,
         initialTasks } from '../../redux/modules/task';
import TaskItem from 'components/TaskItem/TaskItem';
import NewTask from 'components/NewTask/NewTask';
// material ui
import Dialog from 'material-ui/lib/dialog';
import Table from 'material-ui/lib/table/table';
import TableHeaderColumn from 'material-ui/lib/table/table-header-column';
import TableRow from 'material-ui/lib/table/table-row';
import TableHeader from 'material-ui/lib/table/table-header';
import TableBody from 'material-ui/lib/table/table-body';
import FloatingActionButton from 'material-ui/lib/floating-action-button';
import FlatButton from 'material-ui/lib/flat-button';
import ContentAdd from 'material-ui/lib/svg-icons/content/add';
import NavigationArrowDownward from 'material-ui/lib/svg-icons/navigation/arrow-downward';
import NavigationArrowUpward from 'material-ui/lib/svg-icons/navigation/arrow-upward';

class TaskView extends Component {

  constructor (props) {
    super(props);
    this.handleSortClick = this.handleSortClick.bind(this);
    this.createNewTask = this.createNewTask.bind(this);
    this.saveNewTask = this.saveNewTask.bind(this);
    this.saveEditTask = this.saveEditTask.bind(this);
    this.state = {
      sort: {
        key: 'end',
        ascending: true
      },
      open: false,
      newTask: fromJS(getNewTask()),
      edit: false,
      selectedTask: fromJS(getNewTask())
    };
  }

  componentWillMount () {
    const { addTask } = this.props;
    initialTasks.forEach((task) => {
      addTask(fromJS(task));
    });
  }

  static propTypes = {
    addTask: PropTypes.func,
    updateTask: PropTypes.func,
    tasks: PropTypes.object
  }

  handleSortClick = (key) => (evt) => {
    this.setState({
      sort: {
        key,
        ascending: !this.state.sort.ascending
      }
    });
  }

  getSortedTasks () {
    const { tasks } = this.props;
    const { sort } = this.state;
    const { key } = sort;
    let sortedTasks = tasks.sortBy((task) => {
      return task.get(key);
    });
    const p = sort.ascending? sortedTasks : sortedTasks.reverse();
    return p;
  }

  onTaskUpdate = (newTask) => {
    const { updateTask } = this.props;
    updateTask(newTask);
  }

  createNewTask () {
    this.setState({
      open: true,
      newTask: fromJS(getNewTask())
    });
  };

  updateNewTask = (task) => {
    this.setState({
      newTask: task
    });
  }

  updateEditTask = (task) => {
    console.debug('task updated');
    console.debug(task);
    this.setState({
      selectedTask: task
    });
  }

  saveNewTask () {
    const { addTask } = this.props;
    const { newTask } = this.state;
    addTask(newTask);
    this.setState({
      open: false
    });
  }

  saveEditTask () {
    const { updateTask } = this.props;
    const { selectedTask } = this.state;
    updateTask(selectedTask);
    this.setState({
      edit: false
    });
  }

  handleClose = () => {
    this.setState({
      open: false
    });
  };

  handleEditClose = () => {
    this.setState({
      edit: false
    });
  };

  handleRowClick = (task) => {
    console.debug(task);
    this.setState({
      edit: true,
      selectedTask: task
    });
  }

  render () {
    const { newTask, selectedTask } = this.state;
    const sortedTasks = this.getSortedTasks();
    const styles = {
      taskHeader: {
        cursor: 'pointer',
        padding: '0'
      },
      columnLabel: {
        padding: '22px'
      },
      label: {
        lineHeight: '27px',
        verticalAlign: 'middle'
      },
      active: {
        fontWeight: 'bold',
        color: '#000'
      },
      icon: {
        marginLeft: '12px',
        height: '18px',
        width: '18px',
        verticalAlign: 'middle'
      },
      xl: {
        width: '275px'
      },
      l: {
        width: '175px'
      },
      m: {
        width: '130px'
      },
      s: {
        width: '110px'
      }
    };

    const durationHeader = Object.assign({}, styles.taskHeader, styles.s);
    const statusHeader = Object.assign({}, styles.taskHeader, styles.m);
    const dateHeader = Object.assign({}, styles.taskHeader, styles.l);
    const assigneeHeader = Object.assign({}, styles.taskHeader, styles.xl);
    const completenessHeader = Object.assign({}, styles.taskHeader, styles.xl);

    const sortIcon = (key) => {
      const { sort } = this.state;
      let icon;
      if (key === sort.key) {
        icon = sort.ascending
          ? <NavigationArrowDownward
            style={styles.icon}/>
          : <NavigationArrowUpward
            style={styles.icon}/>;
      } else {
        icon = <div></div>;
      }
      return icon;
    };

    const labelStyle = (key) => {
      const { sort } = this.state;
      let style;
      if (key === sort.key) {
        style = Object.assign(styles.active, styles.label);
      } else {
        style = styles.label;
      }
      return style;
    };

    const actions = [
      <FlatButton
        label='Cancel'
        secondary
        onTouchTap={this.handleClose}
      />,
      <FlatButton
        label='Add'
        primary
        onTouchTap={this.saveNewTask}
      />
    ];

    const editActions = [
      <FlatButton
        label='Cancel'
        secondary
        onTouchTap={this.handleEditClose}
      />,
      <FlatButton
        label='Save'
        primary
        onTouchTap={this.saveEditTask}
      />
    ];

    return (
      <div>
        <Table>
          <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
            <TableRow>
              // Task name
              <TableHeaderColumn style={styles.taskHeader}>
                <div
                  style={styles.columnLabel}
                  onClick={this.handleSortClick('name')}>
                  <span style={labelStyle('name')}>Task</span>
                  {sortIcon('name')}
                </div>
              </TableHeaderColumn>
              // Duration
              <TableHeaderColumn style={durationHeader}>
                <div
                  style={styles.columnLabel}
                  onClick={this.handleSortClick('duration')}>
                  <span style={labelStyle('duration')}>Duration</span>
                  {sortIcon('duration')}
                </div>
              </TableHeaderColumn>
              // Begin Date
              <TableHeaderColumn style={dateHeader}>
                <div
                  style={styles.columnLabel}
                  onClick={this.handleSortClick('begin')}>
                  <span style={labelStyle('begin')}>Begin Date</span>
                  {sortIcon('begin')}
                </div>
              </TableHeaderColumn>
              // End Date
              <TableHeaderColumn style={dateHeader}>
                <div
                  style={styles.columnLabel}
                  onClick={this.handleSortClick('end')}>
                  <span style={labelStyle('end')}>End Date</span>
                  {sortIcon('end')}
                </div>
              </TableHeaderColumn>
              // Assignee
              <TableHeaderColumn style={assigneeHeader}>
                <div
                  style={styles.columnLabel}
                  onClick={this.handleSortClick('assignee')}>
                  <span style={labelStyle('assignee')}>Assignee</span>
                  {sortIcon('assignee')}
                </div>
              </TableHeaderColumn>
              // Status
              <TableHeaderColumn style={statusHeader}>
                <div
                  style={styles.columnLabel}
                  onClick={this.handleSortClick('status')}>
                  <span style={labelStyle('status')}>Status</span>
                  {sortIcon('status')}
                </div>
              </TableHeaderColumn>
              // Completeness
              <TableHeaderColumn style={completenessHeader}>
                <div
                  style={styles.columnLabel}
                  onClick={this.handleSortClick('completeness')}>
                  <span style={labelStyle('completeness')}>Completeness</span>
                  {sortIcon('completeness')}
                </div>
              </TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody
            deselectOnClickaway
            showRowHover
          >
          {
            sortedTasks.toList().map((task) => {
              return (
                <TaskItem
                  key={task.get('id')}
                  task={task}
                  onUpdate={this.onTaskUpdate}
                  onEdit={this.handleRowClick}
                />
              );
            })
          }
          </TableBody>
        </Table>
        <FloatingActionButton style={{
          position: 'fixed',
          right: '30px',
          bottom: '30px'
        }}
          onClick={this.createNewTask}>
          <ContentAdd />
        </FloatingActionButton>
        <Dialog
          title='New Task'
          actions={actions}
          modal={false}
          contentStyle={{maxWidth: '1200px'}}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          <NewTask
            key={newTask.get('id')}
            task={newTask}
            onUpdate={this.updateNewTask}
          />
        </Dialog>
        <Dialog
          title={selectedTask.get('name')}
          actions={editActions}
          modal={false}
          contentStyle={{maxWidth: '1200px'}}
          open={this.state.edit}
          onRequestClose={this.handleEditClose}
        >
          <NewTask
            key={selectedTask.get('id')}
            task={selectedTask}
            onUpdate={this.updateEditTask}
          />
        </Dialog>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  tasks: state.tasks
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  addTask,
  updateTask
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(TaskView);
