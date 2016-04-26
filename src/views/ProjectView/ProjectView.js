import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { addProject,
         getNewProject,
         initialProjects } from '../../redux/modules/projects';
import moment from 'moment';
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
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      sort: {
        key: 'end',
        ascending: true
      }
    };
  }

  componentWillMount () {
    const { addProject } = this.props;
    console.debug(initialProjects);
    initialProjects.forEach((project) => {
      addProject(project);
    });
  }

  static propTypes = {
    addProject: PropTypes.func,
    sortAscending: PropTypes.func,
    projects: PropTypes.object
  }

  handleClick = (key) => (evt) => {
    this.setState({
      sort: {
        key,
        ascending: !this.state.sort.ascending
      }
    });
  }

  getSortedProjects () {
    const { projects } = this.props;
    console.debug(projects);
    const { sort } = this.state;
    let sortedProjects = projects.sortBy(
      (val, key) => {
        return val.get(sort.key);
      });
    return sort.ascending? sortedProjects : sortedProjects.reverse();
  }

  newProject () {
    const { addProject } = this.props;
    const millis = moment().valueOf();
    const newProject = getNewProject(millis);
    addProject(newProject);
  }

  render () {
    const { sort } = this.state;
    const headers = [
      {key: 'project', pretty: 'Project'},
      {key: 'duration', pretty: 'Duration'},
      {key: 'begin', pretty: 'Begin Date'},
      {key: 'end', pretty: 'End Date'},
      {key: 'assignee', pretty: 'Assginee'},
      {key: 'status', pretty: 'Status'},
      {key: 'completeness', pretty: 'Completeness'}
    ];
    const sortedProjects = this.getSortedProjects();

    const styles = {
      columnHeader: {
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
      }
    };

    return (
      <div>
        <Table>
          <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
            <TableRow>
            {
              headers.map((header, i) => {
                let label;
                let headerStyle;
                if (sort.key === header.key) {
                  label = (
                    <div style={styles.label}>
                      <span
                        style={Object.assign(styles.active, styles.label)}>
                        {header.pretty}
                      </span>
                      {sort.ascending
                        ? <NavigationArrowDownward
                          style={styles.icon}/>
                        : <NavigationArrowUpward
                          style={styles.icon}/>
                      }
                    </div>
                  );
                } else {
                  label = <span style={styles.label}>{header.pretty}</span>;
                }

                if (header.key === 'duration') {
                  headerStyle = Object.assign(
                    {width: '110px'},
                    styles.columnHeader);
                } else {
                  headerStyle = styles.columnHeader;
                }
                return (
                  <TableHeaderColumn
                    style={headerStyle}
                    key={i}
                  >
                    <div
                      style={styles.columnLabel}
                      onClick={this.handleClick(header.key)}>
                      {label}
                    </div>
                  </TableHeaderColumn>
                );
              })
            }
            </TableRow>
          </TableHeader>
          <TableBody>
          {
            sortedProjects.map((project) => {
              return (
                <ProjectItem
                  key={project.get('created')}
                  project={project}
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
  addProject
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ProjectView);
