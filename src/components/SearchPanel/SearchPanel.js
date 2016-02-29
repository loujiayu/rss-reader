import React, { PropTypes, Component } from 'react'
import ReactDom from 'react-dom'
import { connect } from 'react-redux'
import {closePanel} from 'redux/modules/feedly';
import {subscribe} from 'redux/modules/manage'

@connect(state => ({data: state.feedly.data,
                    loading: state.feedly.loading,
                    loaded: state.feedly.loaded,
                    closed: state.feedly.closed,
                    user: state.auth.user}), {closePanel, subscribe})
export default class SearchPanel extends Component {
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
  render() {
    const styles = require('./SearchPanel.less')
    const {data, loading, loaded, closed} = this.props
    var panelStyle
    if(loading || loaded) {
      panelStyle = styles.searchPanel + ' ' + styles.bounceIn
    } else {
      panelStyle = styles.untrigger
    }
    if(closed) {
      panelStyle = styles.searchPanel + ' ' + styles.bounceOut
    }
    console.log(data)
    return (
      <div className={panelStyle}>
        <ul className={styles.searchContent}>
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
      </div>
    )
  }
}
