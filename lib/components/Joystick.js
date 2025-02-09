import React from 'react';
import {
  View,
  StyleSheet,
  PanResponder,
  ViewPropTypes,
} from 'react-native';
import {
  NOOP,
  getTopLeftCoordinatesFromCenter
} from '../utilities/utilityFunctions';
import Draggable from '../elements/Draggable';
import JoystickBackground from '../elements/JoystickBackground';
import PropTypes from 'prop-types';


const DEFAULT_HANDLE_SIZE = 30;

class Joystick extends React.Component {
  static propTypes = {
    animationType: PropTypes.object,
    backgroundStyle: ViewPropTypes.style,
    draggablePosition: PropTypes.object,
    draggableStyle: ViewPropTypes.style,
    hasResponderOverride: PropTypes.bool,
    isSticky: PropTypes.bool,
    stickyY: PropTypes.number,
    stickyX: PropTypes.number,
    length: PropTypes.number.isRequired,
    neutralPointX: PropTypes.number,
    neutralPointY: PropTypes.number,
    onDraggableMove: PropTypes.func,
    onDraggableRelease: PropTypes.func,
    onDraggableStart: PropTypes.func,
    shape: PropTypes.oneOf(['vertical', 'horizontal', 'circular']).isRequired,
  };

  static defaultProps = {
    onDraggableMove: NOOP,
    onDraggableRelease: NOOP,
    onDraggableStart: NOOP,
    stickyX: 0,
    stickyY: 0,
  }

  constructor(props) {
    super(props);

    this.state = {
      draggablePosition: undefined,
      draggableAnimationType: { type: 'none' },
    };
    this._setDraggableDimensions();
    this._setConstraints();

    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderStart: () => this.setState.bind(this)({ draggableAnimationType: { type: 'none' } }),
      onPanResponderMove: (evt, gesture) =>
        this.setState.bind(this)({ draggablePosition: gesture }),
      onPanResponderEnd: (evt, gesture) => {
        this.setState({
          draggableAnimationType: { type: 'spring' },
          draggablePosition: { dx: 0, dy: 0 },
        });
      }
    });

    this.handleDraggableMove = this.handleDraggableMove.bind(this);
    this.handleDraggableRelease = this.handleDraggableRelease.bind(this);
    this.handleDraggableStart = this.handleDraggableStart.bind(this);
  };

  handleDraggableMove(touch) {
    this.props.onDraggableMove(touch);
  }

  handleDraggableRelease(touch) {
    this.props.onDraggableRelease(touch);
  }

  handleDraggableStart() {
    this.props.onDraggableStart();
  }

  _setDraggableDimensions() {
    let specifiedDraggableWidth;
    let specifiedDraggableHeight;
    if (this.props.draggableStyle) {
      specifiedDraggableHeight = StyleSheet.flatten(this.props.draggableStyle).height;
      specifiedDraggableWidth = StyleSheet.flatten(this.props.draggableStyle).width;
    };
    this.draggableHeight = specifiedDraggableHeight ? specifiedDraggableHeight : DEFAULT_HANDLE_SIZE;
    this.draggableWidth = specifiedDraggableWidth ? specifiedDraggableWidth : DEFAULT_HANDLE_SIZE;
  }

  _setConstraints() {
    if (this.props.shape === 'circular') {
      this.draggableRConstraint = this.props.length;
    }
    if (this.props.shape === 'vertical') {
      this.draggableXConstraints = [0, 0];
      this.draggableYConstraints = [-this.props.length, this.props.length];
    }
    if (this.props.shape === 'horizontal') {
      this.draggableXConstraints = [-this.props.length, this.props.length];
      this.draggableYConstraints = [0, 0];
    }
  };

  render() {
    let draggablePosition = getTopLeftCoordinatesFromCenter(
      this.props.neutralPointY,
      this.props.neutralPointX,
      this.draggableWidth,
      this.draggableHeight,
    );
    let defaultStyle = StyleSheet.create({
      draggable: {
        height: this.draggableHeight,
        width: this.draggableWidth,
        backgroundColor: 'black',
        borderRadius: this.draggableWidth / 2,
      }
    });


    return (
      <View>
        <JoystickBackground
          heightOfHandle={this.draggableHeight}
          length={this.props.length}
          neutralPointX={this.props.neutralPointX}
          neutralPointY={this.props.neutralPointY}
          shape={this.props.shape}
          style={this.props.backgroundStyle}
          widthOfHandle={this.draggableWidth}
        />
        <Draggable
          animationType={this.props.animationType}
          draggablePosition={this.props.draggablePosition}
          left={draggablePosition.left}
          onDraggableMove={this.handleDraggableMove}
          onDraggableRelease={this.handleDraggableRelease}
          onDraggableStart={this.handleDraggableStart}
          rConstraint={this.draggableRConstraint}
          responderOverride={this.props.hasResponderOverride}
          sticky={this.props.isSticky}
          stickyX={this.props.stickyX}
          stickyY={this.props.stickyY}
          style={[defaultStyle.draggable, this.props.draggableStyle]}
          top={draggablePosition.top}
          xConstraints={this.draggableXConstraints}
          yConstraints={this.draggableYConstraints}
        />
      </View>
    );
  }

};

export default Joystick;
