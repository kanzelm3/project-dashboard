import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Plotly from 'plotly.js';
import Theme from '../../helpers/theme.js';

class Position3D extends React.Component {

  // data should be an array of track and truth data
  // filtered by a track id
  static propTypes = {
    data: PropTypes.object,
    title: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number
  }

  constructor () {
    super();
    this.state = {};
  }

  componentDidMount () {
    const plotDiv = ReactDOM.findDOMNode(this);
    this.setState({
      plotDiv
    });
    Plotly.newPlot(plotDiv, this.createPlotData(this.props.data), this.createLayout());
  }

  componentWillReceiveProps (nextProps) {
    const { plotDiv } = this.state;
    if (plotDiv) {
      Plotly.newPlot(plotDiv, this.createPlotData(nextProps.data), this.createLayout());
    }
  }

  createPlotData (data) {
    let truthX = [];
    let truthY = [];
    let truthZ = [];
    let trackX = [];
    let trackY = [];
    let trackZ = [];

    data.forEach((row) => {
      if (row.get('type') === 'truth') {
        truthX.push(row.get('sv_ecef_x'));
        truthY.push(row.get('sv_ecef_y'));
        truthZ.push(row.get('sv_ecef_z'));
      }
      if (row.get('type') === 'track') {
        trackX.push(row.get('sv_ecef_x'));
        trackY.push(row.get('sv_ecef_y'));
        trackZ.push(row.get('sv_ecef_z'));
      }
    });

    return [
      {
        type: 'scatter3d',
        x: truthX,
        y: truthY,
        z: truthZ,
        mode: 'lines+markers',
        marker: {
          color: Theme.palette.truth,
          size: 8,
          opacity: 0.5,
          symbol: 'diamond',
          line: {
            opacity: 0.8,
            width: 1,
            weight: 3,
            color: Theme.palette.truth
          }
        },
        line: {
          opacity: 0.6,
          weight: 3,
          shape: 'spline'
        },
        name: 'Truth'
      },
      {
        type: 'scatter3d',
        x: trackX,
        y: trackY,
        z: trackZ,
        mode: 'lines+markers',
        marker: {
          color: Theme.palette.track,
          size: 6,
          opacity: 0.5,
          symbol: 'dot',
          line: {
            opacity: 0.8,
            width: 1,
            color: Theme.palette.track
          }
        },
        line: {
          opacity: 0.6,
          shape: 'spline'
        },
        name: 'Track'
      }
    ];
  }

  createLayout () {
    return {
      title: this.props.title,
      width: this.props.width,
      height: this.props.height
    };
  }

  config = {
    showLink: false,
    displayModeBar: true
  };

  makePlot () {

  }

  render () {
    return (
      <div />
    );
  }
}

export default Position3D;
