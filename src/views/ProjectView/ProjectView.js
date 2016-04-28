import React, { Component, PropTypes } from 'react';
import { fromJS } from 'immutable';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { addProject,
         updateProject,
         getNewProject,
         initialProjects } from '../../redux/modules/projects';
import ProjectItem from 'components/ProjectItem/ProjectItem';
import NewProject from 'components/NewProject/NewProject';
// material ui
import Dialog from 'material-ui/lib/dialog';
import Table from 'material-ui/lib/table/table';
import TableHeaderColumn from 'material-ui/lib/table/table-header-column';
import TableRow from 'material-ui/lib/table/table-row';
import TableHeader from 'material-ui/lib/table/table-header';
import TableBody from 'material-ui/lib/table/table-body';
import FloatingActionButton from 'material-ui/lib/floating-action-button';
import FlatButton from 'material-ui/lib/flat-button';
import ContentAdd from 'material-ui/lib/svg-icons/content/add';
import NavigationArrowDownward from 'material-ui/lib/svg-icons/navigation/arrow-downward';
import NavigationArrowUpward from 'material-ui/lib/svg-icons/navigation/arrow-upward';

class ProjectView extends Component {

  constructor (props) {
    super(props);
    this.handleSortClick = this.handleSortClick.bind(this);
    this.createNewProject = this.createNewProject.bind(this);
    this.saveNewProject = this.saveNewProject.bind(this);
    this.state = {
      sort: {
        key: 'end',
        ascending: true
      },
      open: false,
      newProject: fromJS(getNewProject())
    };
  }

  componentWillMount () {
    const { addProject } = this.props;
    initialProjects.forEach((project) => {
      addProject(fromJS(project));
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

  onProjectUpdate = (newProject) => {
    const { updateProject } = this.props;
    updateProject(newProject);
  }

  createNewProject () {
    this.setState({
      open: true,
      newProject: fromJS(getNewProject())
    });
  };

  updateNewProject = (project) => {
    this.setState({
      newProject: project
    });
  }

  saveNewProject () {
    const { addProject } = this.props;
    const { newProject } = this.state;
    console.debug(newProject);
    addProject(newProject);
    this.setState({
      open: false
    });
  }

  handleClose = () => {
    this.setState({
      open: false
    });
  };

  render () {
    const { newProject } = this.state;
    const sortedProjects = this.getSortedProjects();
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
    const statusHeader = Object.assign({}, styles.projectHeader, styles.m);
    const dateHeader = Object.assign({}, styles.projectHeader, styles.l);
    const assigneeHeader = Object.assign({}, styles.projectHeader, styles.xl);
    const completenessHeader = Object.assign({}, styles.projectHeader, styles.xl);

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

    const actions = [
      <FlatButton
        label='Cancel'
        secondary
        onTouchTap={this.handleClose}
      />,
      <FlatButton
        label='Add'
        primary
        onTouchTap={this.saveNewProject}
      />
    ];

    return (
      <div>
        <Table>
          <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
            <TableRow>
              // Project name
              <TableHeaderColumn style={styles.projectHeader}>
                <div
                  style={styles.columnLabel}
                  onClick={this.handleSortClick('project')}>
                  <span style={labelStyle('project')}>Project</span>
                  {sortIcon('project')}
                </div>
              </TableHeaderColumn>
              // Duration
              <TableHeaderColumn style={durationHeader}>
                <div
                  style={styles.columnLabel}
                  onClick={this.handleSortClick('duration')}>
                  <span style={labelStyle('duration')}>Duration</span>
                  {sortIcon('duration')}
                </div>
              </TableHeaderColumn>
              // Begin Date
              <TableHeaderColumn style={dateHeader}>
                <div
                  style={styles.columnLabel}
                  onClick={this.handleSortClick('begin')}>
                  <span style={labelStyle('begin')}>Begin Date</span>
                  {sortIcon('begin')}
                </div>
              </TableHeaderColumn>
              // End Date
              <TableHeaderColumn style={dateHeader}>
                <div
                  style={styles.columnLabel}
                  onClick={this.handleSortClick('end')}>
                  <span style={labelStyle('end')}>End Date</span>
                  {sortIcon('end')}
                </div>
              </TableHeaderColumn>
              // Assignee
              <TableHeaderColumn style={assigneeHeader}>
                <div
                  style={styles.columnLabel}
                  onClick={this.handleSortClick('assignee')}>
                  <span style={labelStyle('assignee')}>Assignee</span>
                  {sortIcon('assignee')}
                </div>
              </TableHeaderColumn>
              // Status
              <TableHeaderColumn style={statusHeader}>
                <div
                  style={styles.columnLabel}
                  onClick={this.handleSortClick('status')}>
                  <span style={labelStyle('status')}>Status</span>
                  {sortIcon('status')}
                </div>
              </TableHeaderColumn>
              // Completeness
              <TableHeaderColumn style={completenessHeader}>
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
          onClick={this.createNewProject}>
          <ContentAdd />
        </FloatingActionButton>
        <Dialog
          title='New Project'
          actions={actions}
          modal={false}
          contentStyle={{maxWidth: '1200px'}}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          <NewProject
            key={newProject.get('id')}
            project={newProject}
            onUpdate={this.updateNewProject}
          />
        </Dialog>
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
