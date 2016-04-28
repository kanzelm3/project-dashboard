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
import NavigationArrowDownward from 'material-ui/lib/svg-icons/navigation/arrow-downward';
import NavigationArrowUpward from 'material-ui/lib/svg-icons/navigation/arrow-upward';

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
        width: '175px'
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

    return (
      <div>
        <Table>
          <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
            <TableRow>
              <TableHeaderColumn style={styles.columnHeader}>
                <div
                  style={styles.columnLabel}
                  onClick={this.handleSortClick('project')}>
                  <span style={labelStyle('project')}>Project</span>
                  {sortIcon('project')}
                </div>
              </TableHeaderColumn>
              <TableHeaderColumn style={styles.columnHeaderDuration}>
                <div
                  style={styles.columnLabel}
                  onClick={this.handleSortClick('duration')}>
                  <span style={labelStyle('duration')}>Duration</span>
                  {sortIcon('duration')}
                </div>
              </TableHeaderColumn>
              <TableHeaderColumn style={styles.columnHeaderDate}>
                <div
                  style={styles.columnLabel}
                  onClick={this.handleSortClick('begin')}>
                  <span style={labelStyle('begin')}>Begin Date</span>
                  {sortIcon('begin')}
                </div>
              </TableHeaderColumn>
              <TableHeaderColumn style={styles.columnHeaderDate}>
                <div
                  style={styles.columnLabel}
                  onClick={this.handleSortClick('end')}>
                  <span style={labelStyle('end')}>End Date</span>
                  {sortIcon('end')}
                </div>
              </TableHeaderColumn>
              <TableHeaderColumn style={styles.columnHeader}>
                <div
                  style={styles.columnLabel}
                  onClick={this.handleSortClick('assignee')}>
                  <span style={labelStyle('assignee')}>Assignee</span>
                  {sortIcon('assignee')}
                </div>
              </TableHeaderColumn>
              <TableHeaderColumn style={styles.columnHeader}>
                <div
                  style={styles.columnLabel}
                  onClick={this.handleSortClick('status')}>
                  <span style={labelStyle('status')}>Status</span>
                  {sortIcon('status')}
                </div>
              </TableHeaderColumn>
              <TableHeaderColumn style={styles.columnHeader}>
                <div
                  style={styles.columnLabel}
                  onClick={this.handleSortClick('completeness')}>
                  <span style={labelStyle('completeness')}>Completeness</span>
                  {sortIcon('completeness')}
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
          right: '30px',
          bottom: '30px'
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
