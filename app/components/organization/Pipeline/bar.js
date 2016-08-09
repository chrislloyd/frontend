import React from 'react';
import Relay from 'react-relay';
import shallowCompare from 'react-addons-shallow-compare';

import BuildTooltip from './build-tooltip';

class Bar extends React.Component {
  static propTypes = {
    href: React.PropTypes.string,
    color: React.PropTypes.string.isRequired,
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired,
    left: React.PropTypes.number.isRequired,
    build: React.PropTypes.object
  };

  state = {
    hover: false
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  render() {
    if(this.props.href) {
      return (
        <a href={this.props.href}
          className="border-box inline-block absolute color-inherit"
          style={{ height: "100%", left: this.props.left, width: this.props.width, bottom: 0 }}
          ref={c => this.barLinkNode = c}
          onMouseOver={this.handleMouseOver}
          onMouseOut={this.handleMouseOut}>
          <div style={{ height: this.props.height, width: this.props.width - 1, left: 0, bottom: 0, backgroundColor: this.props.color }} className="border-box inline-block absolute animation-height" />
          <BuildTooltip build={this.props.build} visible={this.state.hover} left={-20} top={47} />
        </a>
      );
    } else {
      let style = { backgroundColor: this.props.color, height: this.props.height, left: this.props.left, width: this.props.width, bottom: 0 };

      return (
        <div className="border-box inline-block absolute animation-height" style={style} />
      );
    }
  }

  handleMouseOver = () => {
    this.setState({hover: true})
  }

  handleMouseOut = () => {
    this.setState({hover: false})
  }
}


export default Relay.createContainer(Bar, {
  fragments: {
    build: () => Relay.QL`
      fragment on Build {
        ${BuildTooltip.getFragment('build')}
      }
    `
  }
});
