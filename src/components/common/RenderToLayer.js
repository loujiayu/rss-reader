import {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';

// heavily inspired by https://github.com/Khan/react-components/blob/master/js/layered-component-mixin.jsx
class RenderToLayer extends Component {
  static propTypes = {
    componentClickAway: PropTypes.func,
    open: PropTypes.bool.isRequired,
    render: PropTypes.func.isRequired,
    useLayerForClickAway: PropTypes.bool,
  };

  static defaultProps = {
    useLayerForClickAway: true,
  };


  componentDidMount() {
    this.renderLayer();
  }

  componentDidUpdate() {
    this.renderLayer();
  }

  componentWillUnmount() {
    this.unrenderLayer();
  }

  onClickAway = (event) => {
    if (event.defaultPrevented) {
      return;
    }

    if (!this.props.componentClickAway) {
      return;
    }

    if (!this.props.open) {
      return;
    }

    const el = this.layer;
    if (event.target !== el && event.target === window ||
      (document.documentElement.contains(event.target) && !Dom.isDescendant(el, event.target))) {
      this.props.componentClickAway(event);
    }
  };

  getLayer() {
    return this.layer;
  }

  unrenderLayer() {
    if (!this.layer) {
      return;
    }
    ReactDOM.unmountComponentAtNode(this.layer);
    document.body.removeChild(this.layer);
    this.layer = null;
  }

  renderLayer() {
    const {
      open,
      render,
    } = this.props;

    if (open) {
      if (!this.layer) {
        this.layer = document.createElement('div');
        document.body.appendChild(this.layer);

        // if (this.props.useLayerForClickAway) {
        //   this.layer.style.position = 'fixed';
        //   this.layer.style.top = 0;
        //   this.layer.style.bottom = 0;
        //   this.layer.style.left = 0;
        //   this.layer.style.right = 0;
        // }
      }

      // By calling this method in componentDidMount() and
      // componentDidUpdate(), you're effectively creating a "wormhole" that
      // funnels React's hierarchical updates through to a DOM node on an
      // entirely different part of the page.

      const layerElement = render();

      if (layerElement === null) {
        this.layerElement = ReactDOM.unstable_renderSubtreeIntoContainer(this, null, this.layer);
      } else {
        this.layerElement = ReactDOM.unstable_renderSubtreeIntoContainer(this, layerElement, this.layer);
      }
    } else {
      this.unrenderLayer();
    }
  }

  render() {
    return null;
  }
}

export default RenderToLayer;
