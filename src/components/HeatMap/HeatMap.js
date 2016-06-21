import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateTask } from '../../redux/modules/task';
import * as WebGLHeatMap from './webgl-heatmap';

class HeatMap extends Component {

  constructor (props) {
    super(props);
    // scope binding
    this.paintAtCoord = this.paintAtCoord.bind(this);
    this.handleMouseMovement = this.handleMouseMovement.bind(this);
    this.update = this.update.bind(this);

    // member vars
    this.raf = window.requestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.msRequestAnimationFrame;
    var mapCanvas = document.getElementById('heatmap');
    this.heatmap = WebGLHeatMap.createWebGLHeatmap({
      canvas: mapCanvas,
      intensityToAlpha: true
    });
    console.debug(this.heatmap);
  }

  componentWillMount () {
    this.update();
  }

  static propTypes = {
    topOffset: PropTypes.number,
    leftOffset: PropTypes.number,
    display: PropTypes.bool
  }

  paintAtCoord = (x, y) => {
    console.debug(x, y);
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
      this.heatmap.addPoint(x + xoff * 50, y + yoff * 50, 20, 2 / 300);
    }
  }

  handleMouseMovement = (event) => {
    const x = event.offsetX || event.clientX;
    const y = event.offsetY || event.clientY;
    this.paintAtCoord(x, y);
  }

  update = () => {
    console.debug('update called');
    this.heatmap.adjustSize();
    this.heatmap.update();
    this.heatmap.display();
  }

  render () {
    const { topOffset, leftOffset } = this.props;
    const styles = {
      monitor: {
        marginTop: topOffset,
        marginLeft: leftOffset,
        height: '100%',
        width: '100%',
        position: 'absolute'
      },
      heatmap: {
        marginTop: topOffset,
        marginLeft: leftOffset,
        height: '100%',
        width: '100%',
        position: 'absolute'
      }
    };

    return (
      <div id='mouse-monitor' style={styles.monitor} onMouseMove={this.handleMouseMovement}>
        <canvas id='heatmap' style={styles.heatmap}></canvas>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  updateTask
}, dispatch);

export default connect(null, mapDispatchToProps)(HeatMap);
