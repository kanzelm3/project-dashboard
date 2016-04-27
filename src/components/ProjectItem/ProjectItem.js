import React, { PropTypes, Component } from 'react';
import { fromJS } from 'immutable';
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

  constructor (props) {
    super(props);
    this.setTitle = this.setTitle.bind(this);
    this.setAssignee = this.setAssignee.bind(this);
    this.setStatus = this.setStatus.bind(this);
    this.setBeginDate = this.setBeginDate.bind(this);
    this.setEndDate = this.setEndDate.bind(this);
    this.setCompleteness = this.setCompleteness.bind(this);
    this.setDuration = this.setDuration.bind(this);
    this.updateProjectValue = this.updateProjectValue.bind(this);
    this.state = {
      completeness: props.project.get('completeness')
    };
  }

  static propTypes = {
    project: PropTypes.object,
    updateProject: PropTypes.func,
    onUpdate: PropTypes.func
  }

  setTitle = (event) => {
    const { value } = event.target;
    this.updateProjectValue({'project': value});
  }

  setAssignee = (event, index, value) => {
    this.updateProjectValue({'assignee': value});
  }

  setStatus = (event, index, value) => {
    const obj = {'status': value};
    if (value === 'Complete') {
      obj.completeness = 1;
    }
    this.updateProjectValue(obj);
  }

  setBeginDate = (event, value) => {
    const { project } = this.props;
    const newBeginDate = moment(value);
    const beginString = newBeginDate.format('MM/DD/YYYY');
    const endDate = moment(project.get('end'), 'MM-DD-YYYY');
    const difference = endDate.diff(newBeginDate, 'days');
    this.updateProjectValue({
      'begin': beginString,
      'duration': difference
    });
  };

  setEndDate = (event, value) => {
    const { project } = this.props;
    const newEndDate = moment(value);
    const endString = newEndDate.format('MM/DD/YYYY');
    const begin = moment(project.get('begin'), 'MM-DD-YYYY');
    const difference = newEndDate.diff(begin, 'days');
    this.updateProjectValue({
      'end': endString,
      'duration': difference
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
    const { project } = this.props;
    if (completeness === 1) {
      obj.status = 'Complete';
    } else {
      if (project.get('status') === 'Complete') {
        obj.status = 'In Work';
      }
    }
    this.updateProjectValue(obj);
  }

  setDuration = (event) => {
    const { project } = this.props;
    const { value } = event.target;
    const begin = moment(project.get('begin'), 'MM-DD-YYYY');
    const end = begin.add(value, 'd');
    const endString = end.format('MM/DD/YYYY');
    this.updateProjectValue({
      'end': endString,
      'duration': value
    });
  }

  updateProjectValue = (obj) => {
    const { project, onUpdate } = this.props;
    const newProject = project.merge(fromJS(obj));
    onUpdate(newProject);
  }

  render () {
    const { project } = this.props;
    return (
      <TableRow>
        <TableRowColumn>
          <TextField
            defaultValue={project.get('project')}
            onBlur={this.setTitle}
          />
        </TableRowColumn>
        <TableRowColumn style={{width: '110px'}}>
          <TextField
            defaultValue={project.get('duration')}
            onEnterKeyDown={this.setDuration}
            onBlur={this.setDuration} />
        </TableRowColumn>
        <TableRowColumn style={{width: '200px'}}>
          <DatePicker
            defaultValue={project.get('begin')}
            onChange={this.setBeginDate}
            autoOk />
        </TableRowColumn>
        <TableRowColumn style={{width: '200px'}}>
          <DatePicker
            defaultValue={project.get('end')}
            onChange={this.setEndDate}
            autoOk />
        </TableRowColumn>
        <TableRowColumn>
          <SelectField
            value={project.get('assignee')}
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
            value={project.get('status')}
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
              value={project.get('completeness')}
              onChange={this.updateCompleteness}
              onDragStop={this.setCompleteness}/>
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
