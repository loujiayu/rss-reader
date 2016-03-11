import React from 'react';
import ReactDOM from 'react-dom';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import ReactTransitionGroup from 'react-addons-transition-group';
// import Dom from '../utils/dom';
import CircleRipple from './CircleRipple';
import update from 'react-addons-update';

function push(array, obj) {
  const newObj = Array.isArray(obj) ? obj : [obj];
  return update(array, {$push: newObj});
}

function shift(array) {
  //Remove the first element in the array using React immutability helpers
  return update(array, {$splice: [[0, 1]]});
}

function offset(el) {
  const rect = el.getBoundingClientRect();
  return {
    top: rect.top + document.body.scrollTop,
    left: rect.left + document.body.scrollLeft,
  };
}

const TouchRipple = React.createClass({

  propTypes: {
    abortOnScroll: React.PropTypes.bool,
    children: React.PropTypes.node,
  },

  mixins: [
    PureRenderMixin,
  ],

  getDefaultProps() {
    return {
      abortOnScroll: true,
    };
  },

  getInitialState() {
    //Touch start produces a mouse down event for compat reasons. To avoid
    //showing ripples twice we skip showing a ripple for the first mouse down
    //after a touch start. Note we don't store ignoreNextMouseDown in this.state
    //to avoid re-rendering when we change it
    this.ignoreNextMouseDown = false;

    return {
      //This prop allows us to only render the ReactTransitionGroup
      //on the first click of the component, making the inital
      //render faster
      nextKey: 0,
      ripples: []
    };
  },

  start(event, isRippleTouchGenerated) {

    if (this.ignoreNextMouseDown && !isRippleTouchGenerated) {
      this.ignoreNextMouseDown = false;
      return;
    }

    let ripples = this.state.ripples;

    //Add a ripple to the ripples array
    ripples = push(ripples, (
      <CircleRipple
        key={this.state.nextKey}
        style={this.getRippleStyle(event)}
        color={this.props.color}
      />
    ));

    this.ignoreNextMouseDown = isRippleTouchGenerated;
    this.setState({
      nextKey: this.state.nextKey + 1,
      ripples: ripples,
    });
  },

  end() {
    const currentRipples = this.state.ripples;
    this.setState({
      ripples: shift(currentRipples),
    });
    if (this.props.abortOnScroll) {
      this.stopListeningForScrollAbort();
    }
  },

  handleMouseDown(event) {
    //only listen to left clicks
    if (event.button === 0) this.start(event, false);
  },

  handleMouseUp() {
    this.end();
  },

  handleMouseLeave() {
    this.end();
  },

  handleTouchStart(event) {
    //If the user is swiping (not just tapping), save the position so we can
    //abort ripples if the user appears to be scrolling
    if (this.props.abortOnScroll && event.touches) {
      this.startListeningForScrollAbort(event);
      this.startTime = Date.now();
    }
    this.start(event, true);
  },

  handleTouchEnd() {
    this.end();
  },

  //Check if the user seems to be scrolling and abort the animation if so
  handleTouchMove(event) {
    //Stop trying to abort if we're already 300ms into the animation
    const timeSinceStart = Math.abs(Date.now() - this.startTime);
    if (timeSinceStart > 300) {
      this.stopListeningForScrollAbort();
      return;
    }

    //If the user is scrolling...
    const deltaY = Math.abs(event.touches[0].clientY - this.firstTouchY);
    const deltaX = Math.abs(event.touches[0].clientX - this.firstTouchX);
    //Call it a scroll after an arbitrary 6px (feels reasonable in testing)
    if (deltaY > 6 || deltaX > 6) {
      let currentRipples = this.state.ripples;
      const ripple = currentRipples[0];
      //This clone will replace the ripple in ReactTransitionGroup with a
      //version that will disappear immediately when removed from the DOM
      const abortedRipple = React.cloneElement(ripple, {aborted: true});
      //Remove the old ripple and replace it with the new updated one
      currentRipples = shift(currentRipples);
      currentRipples = push(currentRipples, abortedRipple);
      this.setState({ripples: currentRipples}, () => {
        //Call end after we've set the ripple to abort otherwise the setState
        //in end() merges with this and the ripple abort fails
        this.end();
      });
    }
  },

  startListeningForScrollAbort(event) {
    this.firstTouchY = event.touches[0].clientY;
    this.firstTouchX = event.touches[0].clientX;
    //Note that when scolling Chrome throttles this event to every 200ms
    //Also note we don't listen for scroll events directly as there's no general
    //way to cover cases like scrolling within containers on the page
    document.body.addEventListener('touchmove', this.handleTouchMove);
  },

  stopListeningForScrollAbort() {
    document.body.removeEventListener('touchmove', this.handleTouchMove);
  },

  getRippleStyle(event) {
    const style = {};
    const el = ReactDOM.findDOMNode(this);
    const elHeight = el.offsetHeight;
    const elWidth = el.offsetWidth;
    const rect = el.getBoundingClientRect();
    const offset = {
      top: rect.top + document.body.scrollTop,
      left: rect.left + document.body.scrollLeft,
    };
    const isTouchEvent = event.touches && event.touches.length;
    const pageX = isTouchEvent ? event.touches[0].pageX : event.pageX;
    const pageY = isTouchEvent ? event.touches[0].pageY : event.pageY;
    const pointerX = pageX - offset.left;
    const pointerY = pageY - offset.top;
    const topLeftDiag = this.calcDiag(pointerX, pointerY);
    const topRightDiag = this.calcDiag(elWidth - pointerX, pointerY);
    const botRightDiag = this.calcDiag(elWidth - pointerX, elHeight - pointerY);
    const botLeftDiag = this.calcDiag(pointerX, elHeight - pointerY);
    const rippleRadius = Math.max(
      topLeftDiag, topRightDiag, botRightDiag, botLeftDiag
    );
    const rippleSize = rippleRadius * 2;
    const left = pointerX - rippleRadius;
    const top = pointerY - rippleRadius;

    style.height = `${rippleSize}px`;
    style.width = `${rippleSize}px`;
    style.top = `${top}px`;
    style.left = `${left}px`;

    return style;
  },

  calcDiag(a, b) {
    return Math.sqrt((a * a) + (b * b));
  },


  render() {
    const { children } = this.props;
    const { ripples } = this.state;

    const styles = require('./ripple.scss')

    return (
      <ReactTransitionGroup
        onMouseUp={this.handleMouseUp}
        onMouseDown={this.handleMouseDown}
        onMouseLeave={this.handleMouseLeave}
        onTouchStart={this.handleTouchStart}
        onTouchEnd={this.handleTouchEnd}
        className={styles.transGroup}>
        {ripples}
      </ReactTransitionGroup>
    );
  },

});

export default TouchRipple;
