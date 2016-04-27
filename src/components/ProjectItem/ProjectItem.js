import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateProject } from '../../redux/modules/projects';
// material ui
import DatePicker from 'material-ui/lib/date-picker/date-picker';
import SelectField from 'material-ui/lib/select-field';
import MenuItem from 'material-ui/lib/menus/menu-item';
import Slider from 'material-ui/lib/slider';
import TableRow from 'material-ui/lib/table/table-row';
import TableRowColumn from 'material-ui/lib/table/table-row-column';
import TextField from 'material-ui/lib/text-field';
// other imports
import { map } from 'lodash';
import moment from 'moment';
import { employeeNames, statusTypes } from './ProjectItemEnums';

class ProjectItem extends Component {

  constructor () {
    super();
    this.setAssignee = this.setAssignee.bind(this);
  }

  static propTypes = {
    project: PropTypes.object,
    updateProject: PropTypes.func
  }

  setAssignee = (event, index, value) => {
    const { project, updateProject } = this.props;
    const newProject = project.set('assignee', value);
    updateProject(newProject.get('created'), newProject);
    // this.setState({assignee: value});
  }

  setStatus = (event, index, value) => {
    this.setState({status: value});
    if (value === 'Complete') {
      this.setState({completeness: 1});
    }
  }

  setBeginDate = (event, value) => {
    const newBeginDate = moment(value);
    const beginString = newBeginDate.format('MM/DD/YYYY');
    const endDate = moment(this.state.end, 'MM-DD-YYYY');
    const difference = endDate.diff(newBeginDate, 'days');
    this.setState({
      begin: beginString,
      duration: difference});
  };

  setEndDate = (event, value) => {
    const newEndDate = moment(value);
    const endString = newEndDate.format('MM/DD/YYYY');
    const begin = moment(this.state.begin, 'MM-DD-YYYY');
    const difference = newEndDate.diff(begin, 'days');
    this.setState({
      end: endString,
      duration: difference});
  }

  setCompleteness = (event, value) => {
    this.setState({completeness: value});
    if (value === 1) {
      this.setState({status: 'Complete'});
    } else {
      if (this.state.status === 'Complete') {
        this.setState({status: 'In Work'});
      }
    }
  }

  setDuration = (event) => {
    console.debug(event.target.value);
  }

  render () {
    const { project } = this.props;
    const thisProject = project.get('project');
    return (
      <TableRow>
        <TableRowColumn>
          <TextField
            defaultValue={thisProject.get('project')}
          />
        </TableRowColumn>
        <TableRowColumn style={{width: '110px'}}>
          <TextField
            defaultValue={thisProject.get('duration')}
            onEnterKeyDown={this.setDuration}
            onBlur={this.setDuration} />
        </TableRowColumn>
        <TableRowColumn>
          <DatePicker
            defaultValue={thisProject.get('begin')}
            onChange={this.setBeginDate}
            autoOk />
        </TableRowColumn>
        <TableRowColumn>
          <DatePicker
            defaultValue={thisProject.get('end')}
            onChange={this.setEndDate}
            autoOk />
        </TableRowColumn>
        <TableRowColumn>
          <SelectField
            value={thisProject.get('assignee')}
            onChange={this.setAssignee}>
            {
              map(employeeNames, (item, index) => {
                return (
                  <MenuItem
                    value={item}
                    key={index}
                    primaryText={item} />
                );
              })
            }
          </SelectField>
        </TableRowColumn>
        <TableRowColumn>
          <SelectField
            value={thisProject.get('status')}
            onChange={this.setStatus}>
            {
              map(statusTypes, (item, index) => {
                return (
                  <MenuItem
                    value={item}
                    key={index}
                    primaryText={item} />
                );
              })
            }
          </SelectField>
        </TableRowColumn>
        <TableRowColumn>
          <div>
            <Slider step={0.05}
              value={thisProject.get('completeness')}
              onChange={this.setCompleteness}/>
          </div>
        </TableRowColumn>
      </TableRow>
    );
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  updateProject
}, dispatch);

export default connect(null, mapDispatchToProps)(ProjectItem);
