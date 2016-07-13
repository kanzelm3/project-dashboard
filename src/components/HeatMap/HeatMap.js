import React, { PropTypes, Component } from 'react';
import './webgl-heatmap';

class HeatMap extends Component {

  constructor (props) {
    super(props);
    // scope binding
    this.paintHeatMap = this.paintHeatMap.bind(this);
    this.handleMouseMovement = this.handleMouseMovement.bind(this);
    this.update = this.update.bind(this);
  }

  componentDidUpdate = () => {
    const { display, track } = this.props;

    if (track) {
      window.addEventListener('mousemove', this.handleMouseMovement);
    } else {
      window.removeEventListener('mousemove', this.handleMouseMovement);
    }

    if (display) {
      window.removeEventListener('mousemove', this.handleMouseMovement);
      const raf = window.requestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.msRequestAnimationFrame;
      // create heatmap instance
      var mapCanvas = document.getElementById('heatmap');
      /* eslint-disable no-undef */
      this.heatmap = createWebGLHeatmap({canvas: mapCanvas});
      this.paintHeatMap(this.heatmap);
      raf(this.update.bind(this));
    } else {
      // clear the mouse data
      this.mouseData = [];
    }
  }

  componentWillUnmount = () => {
    window.removeEventListener('mousemove', this.handleMouseMovement);
  }

  static propTypes = {
    topOffset: PropTypes.number,
    leftOffset: PropTypes.number,
    display: PropTypes.bool,
    track: PropTypes.bool,
    addData: PropTypes.func,
    clearData: PropTypes.func,
    mouseCoordinates: PropTypes.object
  }

  paintHeatMap = (heatmap) => {
    this.mouseData.forEach((entry) => {
      const x = entry.x;
      const y = entry.y;
      var count = 0;
      while (count < 200) {
        var xoff = Math.random() * 2 - 1;
        var yoff = Math.random() * 2 - 1;
        var l = xoff * xoff + yoff * yoff;
        if (l > 1) {
          continue;
        }
        var ls = Math.sqrt(l);
        xoff /= ls;
        yoff /= ls;
        xoff *= 1 - l;
        yoff *= 1 - l;
        count += 1;
        heatmap.addPoint(x + xoff * 50, y + yoff * 50, 20, 2 / 300);
      }
    });
  }

  handleMouseMovement = (event) => {
    const { track } = this.props;
    if (track) {
      const xVal = event.pageX;
      const yVal = event.pageY;
      this.mouseData.push({x: xVal, y: yVal});
    }
  }

  update = () => {
    this.heatmap.adjustSize();
    this.heatmap.update();
    this.heatmap.display();
  }

  render () {
    // props data
    const { display } = this.props;

    // styles
    const styles = {
      heatmap: {
        marginTop: 0,
        marginLeft: 0,
        height: '100%',
        width: '100%',
        position: 'absolute',
        zIndex: '1103',
        overflow: 'hidden',
        pointerEvents: 'none'
      }
    };

    let element;
    if (display) {
      // create canvas element to paint heatmap
      element = <canvas id='heatmap' style={styles.heatmap} ></canvas>;
    } else {
      element = null;
    }
    return (
      element
    );
  }
}

export default (HeatMap);
