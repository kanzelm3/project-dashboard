import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

class Audio extends Component {

  static propTypes = {
    src: PropTypes.string.isRequired,
    onLoad: PropTypes.func
  };

  static defaultProps = {
    onLoad: () => null
  };

  componentDidMount () {
    const { onLoad } = this.props;
    const player = ReactDOM.findDOMNode(this);
    onLoad(player);
  }

  render () {
    const { src } = this.props;
    return (
      <audio
        src={src}
        preload='none'
      />
    );
  }

}

export default Audio;
