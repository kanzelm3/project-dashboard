import React, { PropTypes, Component } from 'react';
import { fromJS } from 'immutable';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateProject } from '../../redux/modules/projects';
// material ui
import Colors from 'material-ui/lib/styles/colors';
import DatePicker from 'material-ui/lib/date-picker/date-picker';
import SelectField from 'material-ui/lib/select-field';
import MenuItem from 'material-ui/lib/menus/menu-item';
import Slider from 'material-ui/lib/slider';
import TableRow from 'material-ui/lib/table/table-row';
import TableRowColumn from 'material-ui/lib/table/table-row-column';
import TextField from 'material-ui/lib/text-field';
import FlatButton from 'material-ui/lib/flat-button';
// other imports
import { map } from 'lodash';
import moment from 'moment';
import { employeeNames, statusTypes } from './ProjectItemEnums';

class ProjectItem extends Component {

  constructor (props) {
    super(props);
    const { project } = props;
    this.setTitle = this.setTitle.bind(this);
    this.setAssignee = this.setAssignee.bind(this);
    this.setStatus = this.setStatus.bind(this);
    this.setBeginDate = this.setBeginDate.bind(this);
    this.setEndDate = this.setEndDate.bind(this);
    this.setCompleteness = this.setCompleteness.bind(this);
    this.setDuration = this.setDuration.bind(this);
    this.updateProjectValue = this.updateProjectValue.bind(this);
    this.state = {
      completeness: project.get('completeness'),
      duration: project.get('duration')
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
    const duration = project.get('duration');
    const endDate = newBeginDate.add(duration, 'd');
    const endString = endDate.format('MM/DD/YYYY');
    this.updateProjectValue({
      'begin': beginString,
      'end': endString
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

  updateDuration = (event) => {
    const { value } = event.target;
    this.setState({
      duration: value
    });
  }

  updateProjectValue = (obj) => {
    const { project, onUpdate } = this.props;
    const newProject = project.merge(fromJS(obj));
    onUpdate(newProject);
  }

  render () {
    const { project } = this.props;
    const endDate = new Date(project.get('end'));
    const beginDate = new Date(project.get('begin'));
    const status = project.get('status');
    const style = {
      slider: {
        width: '175px',
        float: 'left'
      },
      sliderVal: {
        float: 'right',
        marginTop: '24px'
      },
      xLarge: {
        width: '275px'
      },
      large: {
        width: '175px'
      },
      medium: {
        width: '130px'
      },
      small: {
        width: '110px'
      }
    };

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
        <TableRowColumn>
          <TextField
            defaultValue={project.get('project')}
            onBlur={this.setTitle}
            style={{width: '100%'}}
          />
        </TableRowColumn>
        <TableRowColumn style={{width: '110px'}}>
          <TextField
            value={this.state.duration}
            onChange={this.updateDuration}
            onEnterKeyDown={this.setDuration}
            onBlur={this.setDuration} />
        </TableRowColumn>
        <TableRowColumn style={style.large}>
          <DatePicker
            value={beginDate}
            onChange={this.setBeginDate}
            autoOk />
        </TableRowColumn>
        <TableRowColumn style={style.large}>
          <DatePicker
            value={endDate}
            onChange={this.setEndDate}
            minDate={beginDate}
            autoOk />
        </TableRowColumn>
        <TableRowColumn style={style.xLarge}>
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
        <TableRowColumn style={style.medium}>
          <FlatButton
            label={status}
            style={getStatusStyle(status)} />
        </TableRowColumn>
        <TableRowColumn style={style.xLarge}>
          <div>
            <Slider step={0.05}
              style={style.slider}
              value={project.get('completeness')}
              onChange={this.updateCompleteness}
              onDragStop={this.setCompleteness}/>
            <span style={style.sliderVal}>
              {Math.round(100*this.state.completeness)}%
            </span>
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
