import React, { PropTypes, Component } from 'react';
import { fromJS } from 'immutable';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateProject } from '../../redux/modules/projects';
// material ui
import DatePicker from 'material-ui/lib/date-picker/date-picker';
import SelectField from 'material-ui/lib/select-field';
import MenuItem from 'material-ui/lib/menus/menu-item';
import Table from 'material-ui/lib/table/table';
import TextField from 'material-ui/lib/text-field';
import TableHeaderColumn from 'material-ui/lib/table/table-header-column';
import TableRow from 'material-ui/lib/table/table-row';
import TableRowColumn from 'material-ui/lib/table/table-row-column';
import TableHeader from 'material-ui/lib/table/table-header';
import TableBody from 'material-ui/lib/table/table-body';
// other imports
import { map } from 'lodash';
import moment from 'moment';
import { employeeNames } from '../ProjectItem/ProjectItemEnums';

class ProjectItem extends Component {

  constructor (props) {
    super(props);
    const { project } = props;
    this.setTitle = this.setTitle.bind(this);
    this.setAssignee = this.setAssignee.bind(this);
    this.setBeginDate = this.setBeginDate.bind(this);
    this.setEndDate = this.setEndDate.bind(this);
    this.setDuration = this.setDuration.bind(this);
    this.updateProjectValue = this.updateProjectValue.bind(this);
    this.state = {
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

    const styles = {
      projectHeader: {
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

    const durationHeader = Object.assign({}, styles.projectHeader, styles.s);
    const dateHeader = Object.assign({}, styles.projectHeader, styles.l);
    const assigneeHeader = Object.assign({}, styles.projectHeader, styles.xl);

    return (
      <Table>
        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
          <TableRow>
            // Project name
            <TableHeaderColumn>
              Project Name
            </TableHeaderColumn>
            // Duration
            <TableHeaderColumn style={durationHeader}>
              Duration
            </TableHeaderColumn>
            // Begin Date
            <TableHeaderColumn style={dateHeader}>
              Begin Date
            </TableHeaderColumn>
            // End Date
            <TableHeaderColumn style={dateHeader}>
              End Date
            </TableHeaderColumn>
            // Assignee
            <TableHeaderColumn style={assigneeHeader}>
              Assignee
            </TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={false}>
          <TableRow>
            // Project name
            <TableRowColumn>
              <TextField
                defaultValue={project.get('project')}
                onBlur={this.setTitle}
                style={{width: '100%'}}
              />
            </TableRowColumn>
            // Duration
            <TableRowColumn style={durationHeader}>
              <TextField
                value={this.state.duration}
                onChange={this.updateDuration}
                onEnterKeyDown={this.setDuration}
                onBlur={this.setDuration} />
            </TableRowColumn>
            // Begin Date
            <TableRowColumn style={dateHeader}>
              <DatePicker
                value={beginDate}
                onChange={this.setBeginDate}
                autoOk />
            </TableRowColumn>
            // End Date
            <TableRowColumn style={dateHeader}>
              <DatePicker
                value={endDate}
                onChange={this.setEndDate}
                minDate={beginDate}
                autoOk />
            </TableRowColumn>
            // Assignee
            <TableRowColumn style={assigneeHeader}>
              <SelectField
                value={project.get('assignee')}
                onChange={this.setAssignee}
                hintText={'Whos the lucky devil?'}>
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
          </TableRow>
        </TableBody>
      </Table>
    );
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  updateProject
}, dispatch);

export default connect(null, mapDispatchToProps)(ProjectItem);
