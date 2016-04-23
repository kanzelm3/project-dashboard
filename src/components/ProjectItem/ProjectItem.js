import React, { PropTypes, Component } from 'react';
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
    const beginDate = moment(props.begin, 'MM-DD-YYYY');
    const endDate = moment(props.end, 'MM-DD-YYYY');
    const difference = endDate.diff(beginDate, 'days');
    this.state = {
      project: props.project,
      begin: props.begin,
      end: props.end,
      assignee: props.assignee,
      duration: difference,
      status: props.status,
      completeness: props.completeness
    };
  }

  static propTypes = {
    project: PropTypes.string,
    begin: PropTypes.string,
    end: PropTypes.string,
    assignee: PropTypes.string,
    status: PropTypes.string,
    completeness: PropTypes.number
  }

  setEmployee = (event, index, value) => {
    this.setState({assignee: value});
  }

  setStatus = (event, index, value) => {
    this.setState({status: value});
  }

  setBeginDate = (event, value) => {
    const newBeginDate = moment(value);
    const beginString = newBeginDate.format('MM/DD/YYYY');
    const endDate = moment(this.state.end, 'MM-DD-YYYY');
    const difference = endDate.diff(newBeginDate, 'days');
    this.setState({begin: beginString,
      duration: difference});
  }

  setEndDate = (event, value) => {
    const newEndDate = moment(value);
    const endString = newEndDate.format('MM/DD/YYYY');
    console.debug(endString);
    const begin = moment(this.state.begin, 'MM-DD-YYYY');
    const difference = newEndDate.diff(begin, 'days');
    this.setState({end: endString,
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

  render () {
    const { project,
      begin,
      end,
      assignee,
      duration,
      status,
      completeness } = this.state;

    return (
      <TableRow>
        <TableRowColumn>
          <TextField
            defaultValue={project}
          />
        </TableRowColumn>
        <TableRowColumn>
          <DatePicker
            defaultValue={begin}
            onChange={this.setBeginDate}
            autoOk />
        </TableRowColumn>
        <TableRowColumn>
          <DatePicker
            defaultValue={end}
            onChange={this.setEndDate}
            autoOk />
        </TableRowColumn>
        <TableRowColumn>
          <SelectField
            value={assignee}
            onChange={this.setEmployee}>
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
          <TextField
            value={duration}
            disabled
          />
        </TableRowColumn>
        <TableRowColumn>
          <SelectField
            value={status}
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
              value={completeness}
              onChange={this.setCompleteness}/>
          </div>
        </TableRowColumn>
      </TableRow>
    );
  }
}

export default ProjectItem;
