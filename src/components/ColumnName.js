import React, { PropTypes } from 'react';

class ColumnName extends React.Component {

  static propTypes = {
    name: PropTypes.string,
    active: PropTypes.bool
  }

  render () {
    const { name, active } = this.props;
    const styles = {
      base: {
        height: '100%',
        width: '100%',
        paddingTop: '15px'
      },
      active: {
        fontWeight: 'bold'
      }
    };

    return (
      <div style={[styles.base, active && styles.active]}>
        {name}
      </div>
    );
  }
}

export default ColumnName;
