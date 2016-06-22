import React, { PropTypes } from 'react';
import { routeActions } from 'react-router-redux';
import { connect } from 'react-redux';
import AppBar from 'material-ui/lib/app-bar';
import { Spacing, Colors } from 'material-ui/lib/styles';
import ThemeManager from 'material-ui/lib/styles/theme-manager';
import IconButton from 'material-ui/lib/icon-button';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import MoreVertIcon from 'material-ui/lib/svg-icons/navigation/more-vert';
import MenuItem from 'material-ui/lib/menus/menu-item';
import Theme from '../../helpers/theme';
import withViewport from '../../helpers/withViewport';
import AppLeftNav from './AppLeftNav';
import HeatMap from 'components/HeatMap/HeatMap';
import '../../styles/core.scss';

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch
  };
};

export class CoreLayout extends React.Component {

  constructor () {
    super();
    this.state = {
      muiTheme: ThemeManager.getMuiTheme(Theme),
      leftNavOpen: false,
      trackMouseMovement: false,
      showHeatmap: false
    };
    this.handleTouchTapLeftIconButton = this.handleTouchTapLeftIconButton.bind(this);
    this.handleChangeRequestLeftNav = this.handleChangeRequestLeftNav.bind(this);
    this.handleRequestChangeList = this.handleRequestChangeList.bind(this);
    this.handleTrackMouseMovement = this.handleTrackMouseMovement.bind(this);
    this.handleShowHeatMap = this.handleShowHeatMap.bind(this);
  }

  static propTypes = {
    viewport: PropTypes.object,
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    children: PropTypes.element,
    dispatch: PropTypes.func
  };

  static contextTypes = {
    router: React.PropTypes.object
  };

  static childContextTypes = {
    muiTheme: PropTypes.object
  };

  static defaultProps = {
    viewport: {}
  };

  getChildContext () {
    return {
      muiTheme: this.state.muiTheme
    };
  }

  get styles () {
    const darkWhite = Colors.darkWhite;
    const { width } = this.props.viewport;

    const styles = {
      appBar: {
        position: 'fixed',
        // Needed to overlap the examples
        zIndex: this.state.muiTheme.zIndex.appBar + 2,
        top: 0,
        fontFamily: Theme.fontFamily
      },
      root: {
        paddingTop: Spacing.desktopKeylineIncrement,
        minHeight: '100vh',
        backgroundColor: '#efefef',
        overflow: 'hidden'
      },
      content: {
        margin: Spacing.desktopGutter / 2
      },
      contentWhenMedium: {
        margin: Spacing.desktopGutter / 2
      },
      footer: {
        backgroundColor: Colors.grey900,
        textAlign: 'center'
      },
      a: {
        color: darkWhite
      },
      p: {
        margin: '0 auto',
        padding: 0,
        color: Colors.lightWhite,
        maxWidth: 335
      },
      iconButton: {
        color: darkWhite
      }
    };

    if (width < 768) {
      styles.content = Object.assign(styles.content, styles.contentWhenMedium);
    }

    return styles;
  }

  handleTouchTapLeftIconButton () {
    const { router } = this.context;
    this.setState({
      leftNavOpen: !this.state.leftNavOpen
    });
    if (router) {
      router.push('/');
    }
  }

  handleChangeMuiTheme (muiTheme) {
    this.setState({
      muiTheme: muiTheme
    });
  }

  handleChangeRequestLeftNav (open) {
    this.setState({
      leftNavOpen: open
    });
  }

  handleRequestChangeList (event, value) {
    const {
      dispatch
    } = this.props;
    dispatch(routeActions.push(value));
    this.setState({
      leftNavOpen: false
    });
  }

  handleTrackMouseMovement () {
    this.setState({
      trackMouseMovement: !this.state.trackMouseMovement,
      showHeatmap: false
    });
  }

  handleShowHeatMap () {
    this.setState({
      showHeatmap: !this.state.showHeatmap
    });
  }

  render () {
    const {
      history,
      location,
      children,
      viewport
    } = this.props;

    const {
      router
    } = this.context;

    const { width } = viewport;

    let {
      leftNavOpen
    } = this.state;

    const {
      prepareStyles
    } = this.state.muiTheme;

    const styles = this.styles;
    let title;
    if (router) {
      title =
        router.isActive('/projects') ? 'Projects'
        : Theme.appName;
    }

    let docked = false;
    let showMenuIconButton = true;

    if (width >= 992 && title !== '') {
      docked = true;
      leftNavOpen = true;
      showMenuIconButton = false;

      styles.leftNav = {
        zIndex: styles.appBar.zIndex - 2
      };
      styles.appBar.marginLeft = 256;
      styles.appBar.width = width-256;
      styles.root.paddingLeft = 256;
      styles.footer.paddingLeft = 256;
    }
    return (
      <div>
        <AppBar
          onLeftIconButtonTouchTap={this.handleTouchTapLeftIconButton}
          title={title}
          zDepth={0}
          style={styles.appBar}
          showMenuIconButton={showMenuIconButton}
          iconElementRight={
            <IconMenu
              iconButtonElement={
                <IconButton><MoreVertIcon /></IconButton>
              }
              targetOrigin={{horizontal: 'right', vertical: 'top'}}
              anchorOrigin={{horizontal: 'right', vertical: 'top'}}
            >
              <MenuItem primaryText='Track Movement'
                checked={this.state.trackMouseMovement}
                onTouchTap={this.handleTrackMouseMovement}
                insetChildren />
              <MenuItem primaryText='Show Heat Map'
                checked={this.state.showHeatmap}
                disabled={!this.state.trackMouseMovement}
                onTouchTap={this.handleShowHeatMap}
                insetChildren />
            </IconMenu>
    }
        />
        <HeatMap
          display={this.state.showHeatmap}
          track={this.state.trackMouseMovement}
          />
        {title !== ''
          ? (
          <div style={prepareStyles(styles.root)}>
            <div style={prepareStyles(styles.content)}>
              {React.cloneElement(children, {
                onChangeMuiTheme: this.handleChangeMuiTheme
              })}
            </div>
          </div>
          )
          : children
        }
        <AppLeftNav
          style={styles.leftNav}
          history={history}
          location={location}
          docked={docked}
          onRequestChangeLeftNav={this.handleChangeRequestLeftNav}
          onRequestChangeList={this.handleRequestChangeList}
          open={leftNavOpen}
        />
      </div>
    );
  }

}

export const CoreLayoutContainer = withViewport(connect(
  mapDispatchToProps
)(CoreLayout));

export default CoreLayoutContainer;
