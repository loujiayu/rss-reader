import React, { PropTypes, Component } from 'react'
import ReactDom from 'react-dom'
import { connect } from 'react-redux'
import {closePanel} from 'redux/modules/feedly';
import {subscribe} from 'redux/modules/manage'
import { TransitionItem } from 'components'
import EventListener from 'react-event-listener';
import RenderToLayer from 'components/common/RenderToLayer'
import ReactTransitionGroup from 'react-addons-transition-group';

@connect(state => ({data: state.feedly.data,
                    loading: state.feedly.loading,
                    loaded: state.feedly.loaded,
                    closed: state.feedly.closed,
                    user: state.auth.user}), {closePanel, subscribe})
class SearchPanelInline extends Component {
  static propTypes = {
    user: PropTypes.string.isRequired,
    data: PropTypes.object,
    loading: PropTypes.bool,
    loaded: PropTypes.bool,
    closePanel: PropTypes.func.isRequired,
    subscribe: PropTypes.func.isRequired
  }
  componentDidMount () {
    document.addEventListener('click', this.handleDocumentClick)
  }
  componentWillUnmount() {
    document.removeEventListener('click', this.handleDocumentClick)
  }
  handleDocumentClick = (event) => {
    var domNode = ReactDom.findDOMNode(this)
    if(!domNode.contains(event.target) && (this.props.loaded||this.props.loading)) {
      this.closeTab()
    }
  }
  closeTab = () => {
    this.props.closePanel()
  }
  handleSubscribe = (item, event) => {
    var {feedId, title, website} = item
    this.props.subscribe({feedId: feedId, title: title, website: website}, this.props.user)
  }
  clickaway = (event) => {
    if (!this.refs.search.contains(event.target)) {
      this.props.closePanel()
    }
  }
  render() {
    const styles = require('./SearchPanel.scss')
    const {data, loading, loaded, closed} = this.props
    var panelStyle
    var open = false
    const easeInStyle = {
      opacity: 1,
      transform: 'translate3d(0, 0, 0)'
    }
    const easeOutStyle = {
      opacity: 0,
      transform: 'translate3d(100%, 0, 0)'
    }
    if(loading || loaded) {
      open = true
    } else {
      open = false
    }
    if(closed) {
      open = false
    }
    const rootStyle = {
      position: 'fixed',
      boxSizing: 'border-box',
      WebkitTapHighlightColor: 'rgba(0,0,0,0)', 
      top: 0,
      left: open ? 0 : -10000,
      width: '100%',
      height: '100%',
    }
    return (
      <div style={rootStyle}>
        {open &&
          <EventListener
            target="window"
            onClick={this.clickaway}
          />
        }
        <ReactTransitionGroup>
          {open &&
            <TransitionItem
              easeInStyle={easeInStyle}
              easeOutStyle={easeOutStyle}
              className={styles.searchPanel}
            >
              <ul className={styles.searchContent} ref="search">
                {loading && <div className={styles.loading}>LOADING</div>}
                {loaded && data.results.map((item, index) => {
                  return (
                    <li key={`searchList.${index}`}>
                      <div className={styles.icon}>
                        <a className={styles.feedOrigin} href={item.website} target="_blank">
                          <img className={styles.feedicon} src={`https://www.google.com/s2/favicons?domain=${item.website}&alt=feed`} />
                          <h4 className={styles.feedname}>{item.title}</h4>
                        </a>
                        <span className={styles.subscribe + " fa fa-plus"}
                                onClick={this.handleSubscribe.bind(this, item)}></span>
                      </div>
                      <p>{item.description}</p>
                    </li>
                  )
                })}
              </ul>
            </TransitionItem>}
        </ReactTransitionGroup>
      </div>

    )
  }
}

export default class SearchPanel extends Component {
  renderLayer = () => {
    return (
      <SearchPanelInline />
    )
  }
  render() {
    // return null
    return (
      <RenderToLayer render={this.renderLayer} open={true} />
    )
  }
}
