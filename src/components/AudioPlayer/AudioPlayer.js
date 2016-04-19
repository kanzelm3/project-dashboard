import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import Audio from './Audio';

class AudioPlayer extends Component {

  static propTypes = {
    style: PropTypes.object,
    src: PropTypes.string.isRequired,
    children: PropTypes.func.isRequired
  };

  static defaultProps = {
    children: () => null
  };

  constructor () {
    super();
    this.state = {
      player: {
        play: () => null,
        pause: () => null,
        load: () => null,
        canPlayType: () => null
      },
      currentTime: 0,
      duration: 0
    };
    this.handlePlayerLoad = this.handlePlayerLoad.bind(this);
    this.setupListeners = this.setupListeners.bind(this);
  }

  handlePlayerLoad (playerRaw) {
    const play = playerRaw.play;
    playerRaw.play = function () {
      if (this.readyState === 0) {
        this.load();
      }
      play.bind(this)();
    };
    this.setState({
      player: _.bindAll(playerRaw, 'play', 'pause', 'load', 'canPlayType')
    }, this.setupListeners);
  }

  setupListeners () {
    const { player } = this.state;
    player.ontimeupdate = () => {
      this.setState({
        currentTime: player.currentTime
      });
    };
    player.ondurationchange = () => {
      this.setState({
        duration: player.duration
      });
    };
    player.onloadedmetadata = () => {
      this.setState({
        duration: player.duration
      });
    };
  }

  render () {
    const { src, style } = this.props;
    const { player } = this.state;
    return (
      <div style={style}>
        <Audio
          src={src}
          onLoad={this.handlePlayerLoad}
          />
        {this.props.children(player)}
      </div>
    );
  }

}

export default AudioPlayer;
