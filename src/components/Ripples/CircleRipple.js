import React from 'react';
import ReactDOM from 'react-dom';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import Transitions from './transitions';

const CircleRipple = React.createClass({

  propTypes: {
    aborted: React.PropTypes.bool,
    style: React.PropTypes.object,
  },

  mixins: [
    PureRenderMixin,
  ],

  getDefaultProps() {
    return {
      opacity: 1,
      aborted: false,
    };
  },

  componentWillAppear(callback) {
    this.initializeAnimation(callback);
  },

  componentWillEnter(callback) {
    this.initializeAnimation(callback);
  },

  componentDidAppear() {
    this.animate();
  },

  componentDidEnter() {
    this.animate();
  },

  componentWillLeave(callback) {
    const style = ReactDOM.findDOMNode(this).style;
    style.opacity = 0;
    //If the animation is aborted, remove from the DOM immediately
    const removeAfter = this.props.aborted ? 0 : 2000;
    setTimeout(() => {
      if (this.isMounted()) callback();
    }, removeAfter);
  },

  animate() {
    const style = ReactDOM.findDOMNode(this).style;
    const transitionValue = `${Transitions.easeOut('2s', 'opacity')}, ${
      Transitions.easeOut('1s', 'transform')}`;
    style['transition'] = transitionValue
    style['transform'] = 'scale(1)'
  },

  initializeAnimation(callback) {
    const style = ReactDOM.findDOMNode(this).style;
    style.opacity = this.props.opacity;
    style['transform'] = 'scale(0)'
    setTimeout(() => {
      if (this.isMounted()) callback();
    }, 0);
  },

  render() {
    const {
      opacity,
      style,
      ...other,
    } = this.props;

    const mergedStyles = Object.assign({
      position: 'absolute',
      top: 0,
      left: 0,
      height: '100%',
      width: '100%',
      borderRadius: '50%',
      backgroundColor: 'rgb(227, 147, 17)',
    }, style);

    return (
      <div {...other} style={mergedStyles} className/>
    );
  },
});

export default CircleRipple;
