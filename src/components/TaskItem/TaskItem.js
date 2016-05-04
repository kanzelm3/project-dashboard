import React, { PropTypes, Component } from 'react';
import { fromJS } from 'immutable';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateTask } from '../../redux/modules/task';
import { durationHeader,
         statusHeader,
         beginHeader,
         endHeader,
         assigneeHeader,
         completenessHeader,
         tableStyles
       } from 'helpers/tableStyles';
// material ui
import Colors from 'material-ui/lib/styles/colors';
import Slider from 'material-ui/lib/slider';
import TableRow from 'material-ui/lib/table/table-row';
import TableRowColumn from 'material-ui/lib/table/table-row-column';
import FlatButton from 'material-ui/lib/flat-button';
// other imports
import moment from 'moment';
import { statusTypes } from './TaskItemEnums';

class TaskItem extends Component {

  constructor (props) {
    super(props);
    const { task } = props;
    this.setTitle = this.setTitle.bind(this);
    this.setAssignee = this.setAssignee.bind(this);
    this.setStatus = this.setStatus.bind(this);
    this.setBeginDate = this.setBeginDate.bind(this);
    this.setEndDate = this.setEndDate.bind(this);
    this.setCompleteness = this.setCompleteness.bind(this);
    this.setDuration = this.setDuration.bind(this);
    this.updateTaskValue = this.updateTaskValue.bind(this);
    this.state = {
      completeness: task.get('completeness'),
      duration: task.get('duration')
    };
  }

  static propTypes = {
    task: PropTypes.object,
    updateTask: PropTypes.func,
    onUpdate: PropTypes.func,
    onEdit: PropTypes.func,
    width: PropTypes.number
  }

  setTitle = (event) => {
    const { value } = event.target;
    this.updateTaskValue({name: value});
  }

  setAssignee = (event, index, value) => {
    this.updateTaskValue({'assignee': value});
  }

  setStatus = (event, index, value) => {
    const obj = {'status': value};
    if (value === 'Complete') {
      obj.completeness = 1;
    }
    this.updateTaskValue(obj);
  }

  setBeginDate = (event, value) => {
    const { task } = this.props;
    const newBeginDate = moment(value);
    const beginString = newBeginDate.format('MM/DD/YYYY');
    const duration = task.get('duration');
    const endDate = newBeginDate.add(duration, 'd');
    const endString = endDate.format('MM/DD/YYYY');
    this.updateTaskValue({
      'begin': beginString,
      'end': endString
    });
  };

  setEndDate = (event, value) => {
    const { task } = this.props;
    const newEndDate = moment(value);
    const endString = newEndDate.format('MM/DD/YYYY');
    const begin = moment(task.get('begin'), 'MM-DD-YYYY');
    const difference = newEndDate.diff(begin, 'days');
    this.updateTaskValue({
      'end': endString,
      'duration': difference
    });
    this.setState({
      duration: difference
    });
  }

  updateCompleteness = (event, value) => {
    this.setState({
      completeness: value
    });
  }

  setCompleteness = (event) => {
    const { completeness } = this.state;
    const obj = {'completeness': completeness};
    const { task } = this.props;
    const today = moment();
    const end = moment(task.get('end'), 'MM-DD-YYYY');
    const diff = today.diff(end, 'd');

    if (completeness === 1) {
      obj.status = 'Complete';
    } else if (diff > 0) {
      obj.status = 'Overdue';
    } else if (completeness === 0) {
      obj.status = 'New';
    } else {
      obj.status = 'In Work';
    }
    this.updateTaskValue(obj);
  }

  setDuration = (event) => {
    const { task } = this.props;
    const { value } = event.target;
    const begin = moment(task.get('begin'), 'MM-DD-YYYY');
    const end = begin.add(value, 'd');
    const endString = end.format('MM/DD/YYYY');
    this.updateTaskValue({
      'end': endString,
      'duration': value
    });
  }

  updateDuration = (event) => {
    const { value } = event.target;
    this.setState({
      duration: value
    });
  }

  updateTaskValue = (obj) => {
    const { task, onUpdate } = this.props;
    const newTask = task.merge(fromJS(obj));
    onUpdate(newTask);
  }

  handleRowClick = (task) => (evt) => {
    const { onEdit } = this.props;
    onEdit(task);
  }

  render () {
    const { task, width } = this.props;
    const status = task.get('status');
    // const tableStyles = {
    //   slider: {
    //     width: '175px',
    //     float: 'left'
    //   },
    //   sliderVal: {
    //     float: 'right',
    //     marginTop: '24px'
    //   },
    //   label: {
    //     fontSize: '16px',
    //     lineHeight: '16px'
    //   },
    //   completenessDiv: {
    //     padding: '0 22px'
    //   }
    // };

    const getStatusStyle = (status) => {
      let color;
      switch (status) {
        case statusTypes[0]:
          color = '#4cb8e9';
          break;
        case statusTypes[1]:
          color = Colors.green500;
          break;
        case statusTypes[2]:
          color = Colors.red500;
          break;
        case statusTypes[3]:
          color = Colors.grey400;
          break;
      }
      return {
        color: color,
        fontSize: '12px',
        fontWeight: 'bold'
      };
    };

    return (
      <TableRow>
        <TableRowColumn style={tableStyles.taskHeader}>
          <div
            style={tableStyles.columnLabel}
            onClick={this.handleRowClick(task)}
          >
            <span style={tableStyles.textLabel}>{task.get('name')}</span>
          </div>
        </TableRowColumn>
        <TableRowColumn style={durationHeader(width)}>
          <div
            style={tableStyles.columnLabel}
            onClick={this.handleRowClick(task)}
          >
            <span style={tableStyles.textLabel}>{task.get('duration')}</span>
          </div>
        </TableRowColumn>
        <TableRowColumn style={beginHeader(width)}>
          <div
            style={tableStyles.columnLabel}
            onClick={this.handleRowClick(task)}
          >
            <span style={tableStyles.textLabel}>{task.get('begin')}</span>
          </div>
        </TableRowColumn>
        <TableRowColumn style={endHeader(width)}>
          <div
            style={tableStyles.columnLabel}
            onClick={this.handleRowClick(task)}
          >
            <span style={tableStyles.textLabel}>{task.get('end')}</span>
          </div>
        </TableRowColumn>
        <TableRowColumn style={assigneeHeader(width)}>
          <div
            style={tableStyles.columnLabel}
            onClick={this.handleRowClick(task)}
          >
            <span style={tableStyles.textLabel}>{task.get('assignee')}</span>
          </div>
        </TableRowColumn>
        <TableRowColumn style={statusHeader}>
          <div
            style={tableStyles.columnLabel}
            onClick={this.handleRowClick(task)}
          >
            <FlatButton
              label={status}
              style={getStatusStyle(status)} />
          </div>
        </TableRowColumn>
        <TableRowColumn style={completenessHeader}>
          <div style={tableStyles.completenessDiv}>
            <Slider step={0.05}
              style={tableStyles.slider}
              value={task.get('completeness')}
              onChange={this.updateCompleteness}
              onDragStop={this.setCompleteness} />
            <span style={tableStyles.sliderVal}>
              {Math.round(100*this.state.completeness)}%
            </span>
          </div>
        </TableRowColumn>
      </TableRow>
    );
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  updateTask
}, dispatch);

export default connect(null, mapDispatchToProps)(TaskItem);
