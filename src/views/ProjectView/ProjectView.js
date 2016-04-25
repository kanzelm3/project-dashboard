import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { addProject } from '../../redux/modules/projects';
// material ui
import ProjectItem from 'components/ProjectItem/ProjectItem';
import Table from 'material-ui/lib/table/table';
import TableHeaderColumn from 'material-ui/lib/table/table-header-column';
import TableRow from 'material-ui/lib/table/table-row';
import TableHeader from 'material-ui/lib/table/table-header';
import TableBody from 'material-ui/lib/table/table-body';
import FloatingActionButton from 'material-ui/lib/floating-action-button';
import ContentAdd from 'material-ui/lib/svg-icons/content/add';

class ProjectView extends Component {

  // constructor (props) {
  //   super(props);
  //   const initialProjects = [
  //     {
  //       project: 'LPWS Refactor',
  //       begin: '03/22/2016',
  //       end: '04/28/2016',
  //       assignee: 'Paddy Fotovich',
  //       duration: 15,
  //       status: 'In Work',
  //       completeness: 0.90
  //     },
  //     {
  //       project: 'End To End Sim Wrapper',
  //       begin: '01/01/2016',
  //       end: '01/15/2016',
  //       assignee: 'Kevin Kanzelmeyer',
  //       duration: 15,
  //       status: 'Overdue',
  //       completeness: 0.60
  //     },
  //     {
  //       project: 'LPWS Phase III Mods',
  //       begin: '03/01/2016',
  //       end: '04/22/2016',
  //       assignee: 'Adam Redmon',
  //       duration: 13,
  //       status: 'In Work',
  //       completeness: 0.95
  //     }
  //   ];
  //   const { addProject } = this.props;
  //   initialProjects.forEach((project) => {
  //     addProject(project);
  //   });
  // }

  static propTypes = {
    addProject: PropTypes.func,
    projects: PropTypes.array
  }

  handleClick = (key) => (evt) => {
    console.debug(`${key} clicked`);
  }

  addProject () {
    console.debug('adding project');
    const newProject = {
      project: 'New Project',
      begin: '01/01/2016',
      end: '01/01/2016',
      assignee: 'Unassigned',
      duration: 0,
      status: 'In Work',
      completeness: 0.0
    };
    addProject(newProject);
    // this.setState({
    //   projects: this.state.projects.concat(
    //     newProject)
    // });
  }

  render () {
    // const { projects } = this.state;
    const { projects } = this.props;
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
              return (
                <ProjectItem
                  key={i}
                  project={project.project}
                  begin={project.begin}
                  end={project.end}
                  assignee={project.assignee}
                  duration={project.duration}
                  status={project.status}
                  completeness={project.completeness}
                />
              );
            })
          }
          </TableBody>
        </Table>
        <FloatingActionButton style={{
          position: 'fixed',
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

const mapStateToProps = (state) => ({
  projects: [state.projects]
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  addProject
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ProjectView);
