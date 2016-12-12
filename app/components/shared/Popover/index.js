import React from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import styled from 'styled-components';

const NIB_WIDTH = 32;

const ScrollZone = styled.div`
  max-height: 80vh;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
`;

const Nib = styled.img`
  top: -20px;
  width: ${NIB_WIDTH}px;
  height: 20px;
  z-index: 3;
`;

Nib.defaultProps = {
  className: 'absolute pointer-events-none'
};

export default class Popover extends React.Component {
  static propTypes = {
    children: React.PropTypes.node.isRequired,
    nibOffset: React.PropTypes.number.isRequired,
    offsetX: React.PropTypes.number.isRequired,
    offsetY: React.PropTypes.number.isRequired,
    style: React.PropTypes.object.isRequired,
    innerRef: React.PropTypes.func.isRequired,
    width: React.PropTypes.number.isRequired
  };

  static defaultProps = {
    nibOffset: 0,
    offsetX: 0,
    offsetY: 35,
    style: {},
    innerRef() {},
    width: 250
  };

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  render() {
    const { children, innerRef, nibOffset, offsetX, offsetY: top, style, width } = this.props;

    const offset = (width / 2) - offsetX;

    const popoverStyles = {
      left: `calc(50% - ${offset}px)`,
      top,
      transformOrigin: `${offset + nibOffset}px -15px`,
      width,
      zIndex: 3
    };

    return (
      <div
        className="absolute mt1 bg-white rounded-2 shadow border border-gray block py1 transition-popup"
        ref={innerRef}
        style={Object.assign(popoverStyles, style)}
      >
        <Nib
          src={require('../../../images/up-pointing-white-nib.svg')}
          style={{
            left: '50%',
            marginLeft: -(NIB_WIDTH / 2) - offsetX + nibOffset
          }}
          alt=""
        />
        <ScrollZone>
          {children}
        </ScrollZone>
      </div>
    );
  }
}

export AnchoredPopover from './anchored';
export calculateViewportOffsets from './calculate-viewport-offsets';
