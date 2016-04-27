import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { addProject,
         updateProject,
         getNewProject,
         initialProjects } from '../../redux/modules/projects';
// material ui
import ProjectItem from 'components/ProjectItem/ProjectItem';
import Table from 'material-ui/lib/table/table';
import TableHeaderColumn from 'material-ui/lib/table/table-header-column';
import TableRow from 'material-ui/lib/table/table-row';
import TableHeader from 'material-ui/lib/table/table-header';
import TableBody from 'material-ui/lib/table/table-body';
import FloatingActionButton from 'material-ui/lib/floating-action-button';
import ContentAdd from 'material-ui/lib/svg-icons/content/add';
// import NavigationArrowDownward from 'material-ui/lib/svg-icons/navigation/arrow-downward';
// import NavigationArrowUpward from 'material-ui/lib/svg-icons/navigation/arrow-upward';

class ProjectView extends Component {

  constructor (props) {
    super(props);
    this.newProject = this.newProject.bind(this);
    this.handleSortClick = this.handleSortClick.bind(this);
    this.state = {
      sort: {
        key: 'end',
        ascending: true
      }
    };
  }

  componentWillMount () {
    const { addProject } = this.props;
    initialProjects.forEach((project) => {
      addProject(project);
    });
  }

  static propTypes = {
    addProject: PropTypes.func,
    updateProject: PropTypes.func,
    projects: PropTypes.object
  }

  handleSortClick = (key) => (evt) => {
    this.setState({
      sort: {
        key,
        ascending: !this.state.sort.ascending
      }
    });
  }

  getSortedProjects () {
    const { projects } = this.props;
    const { sort } = this.state;
    const { key } = sort;
    let sortedProjects = projects.sortBy((project) => {
      return project.get(key);
    });
    const p = sort.ascending? sortedProjects : sortedProjects.reverse();
    return p;
  }

  newProject () {
    const { addProject } = this.props;
    const newProject = getNewProject();
    addProject(newProject);
  }

  onProjectUpdate = (newProject) => {
    const { updateProject } = this.props;
    updateProject(newProject);
  }

  render () {
    const sortedProjects = this.getSortedProjects();
    const styles = {
      columnHeader: {
        cursor: 'pointer',
        padding: '0'
      },
      columnHeaderDuration: {
        cursor: 'pointer',
        padding: '0',
        width: '110px'
      },
      columnHeaderDate: {
        cursor: 'pointer',
        padding: '0',
        width: '200px'
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
                  onClick={this.handleSortClick('project')}>
                    Project
                </div>
              </TableHeaderColumn>
              <TableHeaderColumn style={styles.columnHeaderDuration}>
                <div
                  style={styles.columnLabel}
                  onClick={this.handleSortClick('duration')}>
                    Duration
                </div>
              </TableHeaderColumn>
              <TableHeaderColumn style={styles.columnHeaderDate}>
                <div
                  style={styles.columnLabel}
                  onClick={this.handleSortClick('begin')}>
                    Begin Date
                </div>
              </TableHeaderColumn>
              <TableHeaderColumn style={styles.columnHeaderDate}>
                <div
                  style={styles.columnLabel}
                  onClick={this.handleSortClick('end')}>
                    End Date
                </div>
              </TableHeaderColumn>
              <TableHeaderColumn style={styles.columnHeader}>
                <div
                  style={styles.columnLabel}
                  onClick={this.handleSortClick('assignee')}>
                    Assignee
                </div>
              </TableHeaderColumn>
              <TableHeaderColumn style={styles.columnHeader}>
                <div
                  style={styles.columnLabel}
                  onClick={this.handleSortClick('status')}>
                    Status
                </div>
              </TableHeaderColumn>
              <TableHeaderColumn style={styles.columnHeader}>
                <div
                  style={styles.columnLabel}
                  onClick={this.handleSortClick('completeness')}>
                    Completeness
                </div>
              </TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody>
          {
            sortedProjects.toList().map((project) => {
              return (
                <ProjectItem
                  key={project.get('id')}
                  project={project}
                  onUpdate={this.onProjectUpdate}
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
          onClick={this.newProject}>
          <ContentAdd />
        </FloatingActionButton>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  projects: state.projects
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  addProject,
  updateProject
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ProjectView);
