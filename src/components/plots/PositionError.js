import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Plotly from 'plotly.js';
import { Vector3, CatmullRomCurve3 } from 'three';
import Theme from '../../helpers/theme.js';

class PositionError extends React.Component {

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
    this.props = nextProps;
    if (plotDiv) {
      Plotly.newPlot(plotDiv, this.createPlotData(nextProps.data), this.createLayout());
    }
  }

  createPlotData (data) {
    let truths = [];
    let tracks = [];
    let trackTimes = [];
    let tMax = 0;

    // separate data into new arrays
    data.forEach((row, i) => {
      let point = (new Vector3(
        row.get('sv_ecef_x'),
        row.get('sv_ecef_y'),
        row.get('sv_ecef_z')
      ));
      let t = row.get('t_valid');
      if (t > tMax) {
        tMax = t;
      }
      if (row.get('type') === 'truth') {
        truths.push(point);
      }
      if (row.get('type') === 'track') {
        tracks.push(point);
        trackTimes.push(t);
      }
    });
    const truthSpline = new CatmullRomCurve3(truths);
    let errors = [];
    let indexes = [];
    trackTimes.forEach((time, i) => {
      let tRel = time/tMax;
      let trackPoint = tracks[i];
      let truthPoint = truthSpline.getPoint(tRel);
      let distance = truthPoint.distanceTo(trackPoint);
      errors.push(distance);
      indexes.push(i);
    });
    return [{
      type: 'scatter',
      x: trackTimes,
      y: errors,
      mode: 'markers+lines',
      marker: {
        size: 8,
        opacity: 0.6,
        symbol: 'dot',
        color: Theme.palette.track,
        line: {
          opacity: 0.5,
          width: 1,
          color: Theme.palette.truth
        }
      },
      name: 'Truth'
    }];
  }

  createLayout () {
    const { title, width, height } = this.props;
    return {
      title,
      width,
      height,
      xaxis: {
        title: 'Time'
      },
      yaxis: {
        title: 'Error'
      }
    };
  }

  config = {
    showLink: false,
    displayModeBar: true
  };

  render () {
    return (
      <div />
    );
  }
}

export default PositionError;
