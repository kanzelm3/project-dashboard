import React, { Component } from 'react';
// material ui
import ProjectItem from 'components/ProjectItem/ProjectItem';
import Table from 'material-ui/lib/table/table';
import TableHeaderColumn from 'material-ui/lib/table/table-header-column';
import TableRow from 'material-ui/lib/table/table-row';
import TableHeader from 'material-ui/lib/table/table-header';
import TableBody from 'material-ui/lib/table/table-body';
import FloatingActionButton from 'material-ui/lib/floating-action-button';
import ContentAdd from 'material-ui/lib/svg-icons/content/add';
// other utilities
import { sortBy } from 'lodash';

class ProjectView extends Component {

  constructor () {
    super();
    this.state = {
      projects: [
        {
          project: 'LPWS Refactor',
          begin: '03/22/2016',
          end: '04/28/2016',
          assignee: 'Paddy Fotovich',
          status: 'In Work',
          completeness: 0.90
        },
        {
          project: 'End To End Sim Wrapper',
          begin: '01/01/2016',
          end: '01/15/2016',
          assignee: 'Kevin Kanzelmeyer',
          status: 'Overdue',
          completeness: 0.60
        },
        {
          project: 'LPWS Phase III Mods',
          begin: '03/01/2016',
          end: '04/22/2016',
          assignee: 'Adam Redmon',
          status: 'In Work',
          completeness: 0.95
        }
      ]
    };
    this.addProject = this.addProject.bind(this);
  }

  handleClick = (key) => (evt) => {
    console.debug(`${key} clicked`);
    const vals = sortBy(this.state.projects, key);
    this.setState({projects: vals});
    console.debug(this.state);
  }

  addProject () {
    console.debug('adding project');
    this.setState({
      projects: this.state.projects.concat(
        {
          project: 'New Project',
          begin: '01/01/2016',
          end: '01/01/2016',
          assignee: 'Unassigned',
          status: 'In Work',
          completeness: 0.0
        })
    });
  }

  render () {
    const { projects } = this.state;
    const styles = {
      columnHeader: {
        cursor: 'pointer',
        padding: '0'
      },
      columnLabel: {
        padding: ' 24px'
      },
      active: {
        fontWeight: 'bold'
      }
    };
    console.debug('redrawing');
    return (
      <div>
        <Table>
          <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
            <TableRow>
              <TableHeaderColumn style={styles.columnHeader}>
                <div
                  style={styles.columnLabel}
                  onClick={this.handleClick('project')}>
                    Project
                </div>
              </TableHeaderColumn>
              <TableHeaderColumn style={styles.columnHeader}>
                <div
                  style={styles.columnLabel}
                  onClick={this.handleClick('begin')}>
                    Begin Date
                </div>
              </TableHeaderColumn>
              <TableHeaderColumn style={styles.columnHeader}>
                <div
                  style={styles.columnLabel}
                  onClick={this.handleClick('end')}>
                    End Date
                </div>
              </TableHeaderColumn>
              <TableHeaderColumn style={styles.columnHeader}>
                <div
                  style={styles.columnLabel}
                  onClick={this.handleClick('assignee')}>
                    Assignee
                </div>
              </TableHeaderColumn>
              <TableHeaderColumn style={styles.columnHeader}>
                <div
                  style={styles.columnLabel}
                  onClick={this.handleClick('duration')}>
                    Duration
                </div>
              </TableHeaderColumn>
              <TableHeaderColumn style={styles.columnHeader}>
                <div
                  style={styles.columnLabel}
                  onClick={this.handleClick('status')}>
                    Status
                </div>
              </TableHeaderColumn>
              <TableHeaderColumn style={styles.columnHeader}>
                <div
                  style={styles.columnLabel}
                  onClick={this.handleClick('completeness')}>
                    Completeness
                </div>
              </TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody>
          {
            projects.map((project, i) => {
              console.debug(project);
              return (
                <ProjectItem
                  key={i}
                  project={project.project}
                  begin={project.begin}
                  end={project.end}
                  assignee={project.assignee}
                  status={project.status}
                  completeness={project.completeness}
                />
              );
            })
          }
          </TableBody>
        </Table>
        <FloatingActionButton style={{
          position: 'absolute',
          right: '3%',
          bottom: '5%'
        }}
          onClick={this.addProject}>
          <ContentAdd />
        </FloatingActionButton>
      </div>
    );
  }
}

export default ProjectView;
