import React, { PropTypes, Component } from 'react'
import ReactDom from 'react-dom'
import { connect } from 'react-redux'
import {closePanel} from 'redux/modules/feedly';
import {subscribe} from 'redux/modules/manage'

@connect(state => ({data: state.feedly.data,
                    loading: state.feedly.loading,
                    loaded: state.feedly.loaded,
                    user: state.auth.user}), {closePanel, subscribe})
export default class SearchPanel extends Component {
  static propTypes = {
    data: PropTypes.object,
    loading: PropTypes.bool,
    loaded: PropTypes.bool,
    closePanel: PropTypes.func,
    subscribe: PropTypes.func
  }
  componentDidMount () {
    document.addEventListener('click', this.handleDocumentClick)
  }
  handleDocumentClick = (event) => {
    var domNode = ReactDom.findDOMNode(this)
    if(!domNode.contains(event.target) && this.props.loading) {
      this.closeTab()
    }
  }
  closeTab = () => {
    this.props.closePanel()
  }
  handleSubscribe = (item, event) => {
    // console.log(this.props.user);
    var {feedId, title, website} = item
    this.props.subscribe({feedId: feedId, title: title, website: website}, this.props.user)
  }
  render() {
    const styles = require('./SearchPanel.less')
    const {data, loading, loaded} = this.props
    const panelStyle = loading ? styles.searchPanel + ' ' + styles.bounceIn :
                                 styles.searchPanel + ' ' + styles.bounceOut
    console.log(data)
    return (
      <div className={panelStyle}>
        <div>
          <ul className={styles.searchContent}>
            {loading && <div className={styles.loading}>LOADING</div>}
            {loaded&&!data ? null : data.results.map((item, index) => {
              return (
                <li key={`searchList.${index}`}>
                  <a href={item.website} target="_blank">
                    <h4><img src={`https://www.google.com/s2/favicons?domain=${item.website}&alt=feed`} />{item.title}
                      <span className={styles.subscribe + " fa fa-plus"}
                            onClick={this.handleSubscribe.bind(this, item)}></span></h4>
                  </a>
                  <p>{item.description}</p>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    )
  }
}
