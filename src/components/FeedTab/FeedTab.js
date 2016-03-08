import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import {search} from 'redux/modules/feedly'
import {refresh, getContent} from 'redux/modules/manage'
import {columnSwitch} from 'redux/modules/media'

@connect(state => ({
  user: state.auth.user,
  addone: state.manage.addone,
  list: state.manage.list,
  selected: state.manage.selected,
  refreshing: state.manage.refreshing,
  mode: state.stat.mode,
  view: state.media.view
}), {search, refresh, getContent, columnSwitch})
export default class Column extends Component {
  static propTypes = {
    search: PropTypes.func.isRequired,
    refresh: PropTypes.func.isRequired,
    getContent: PropTypes.func.isRequired,
    columnSwitch: PropTypes.func.isRequired,
    user: PropTypes.string.isRequired,
    view: PropTypes.string.isRequired,
    addone: PropTypes.string,
    list: PropTypes.array,
    selected: PropTypes.array,
    refreshing: PropTypes.bool.isRequired,
    mode: PropTypes.bool.isRequired,
  }
  loadContent = (title, index) => {
    this.props.columnSwitch()
    this.props.getContent(this.props.user, title, index)
  }
  handleSearch = (event) => {
    event.preventDefault()
    const input = this.refs.search
    this.props.search(input.value)
    input.value = ''
  }
  handleRefresh = (event) => {
    this.props.refresh(this.props.user)
  }
  render() {
    const styles = require('./FeedTab.less')
    const {view, list, addone, selected, refreshing, mode} = this.props
    const refreshStyle = refreshing ? "fa fa-refresh fa-spin" : "fa fa-refresh"
    const readMode = mode ? styles.hidden : ''
    var media
    switch (view) {
      case 'FEEDTAB':
        media = ''
        break;
      case 'COLUMN':
        media = styles.delayRes
        break
      case 'CONTENT':
        media = styles.immedRes
        break
      default:
        break
    }
    // const media = view==='FEEDTAB' ? '' : styles.response
    return (
      <div className={`${styles.feeds} ${readMode} ${media}`}>
        <div className={styles.searchBar}>
          <form onSubmit={this.handleSearch}>
            <input type='text' ref="search" placeholder="search"/>
          </form>
        </div>
        <div className={styles.feedList} ref="feedList">
          <div className={styles.feedTab}>
            <ul>
              {list && list.map((item, index) => {
                if(item.ct === 0) {
                  item.ct === null
                }
                var tabStyles = index === selected[1] ? styles.active : ''
                return (
                  <li className={tabStyles} key={`feedList.${index}`} onClick={this.loadContent.bind(this, item.f, index)}>
                    <span className={styles.title}>{item.f}</span>
                    <span className={styles.unread}>{item.ct}</span>
                  </li>
                )
              })}
              {addone && <li>{addone}</li>}
            </ul>
          </div>
        </div>
        <div className={styles.toolBar}>
          <i className={refreshStyle} onClick={this.handleRefresh}></i>
        </div>
      </div>
    )
  }
}
