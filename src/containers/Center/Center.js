import React, { Component, PropTypes } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { connect } from 'react-redux'
import {search, loadContent, stream} from 'redux/modules/feedly';
import {getFeeds, getContent, refresh ,markReaded ,contentSelect} from 'redux/modules/manage'
import {select, changeState, drop} from 'redux/modules/stat'
import {SearchPanel, ContentPenal} from 'components'
import request from 'superagent'

@connect(state => ({loading: state.feedly.loading,
                    user: state.auth.user,
                    addone: state.manage.addone,
                    list: state.manage.list,
                    contents: state.manage.contents,
                    selected: state.manage.selected,
                    status: state.stat.status,
                    entryIndex:state.manage.entryIndex}),
                    {select, getFeeds, search,stream, getContent,
                      markReaded, changeState, contentSelect, refresh})
export default class Home extends Component {
  constructor() {
    super()
    this.state = {
      feedState:'',
      init: false
    }
  }
  static propTypes = {
    loading: PropTypes.bool,
    search: PropTypes.func
    // logout: PropTypes.func
  }
  componentDidMount() {
    this.props.getFeeds(this.props.user)
  }
  handleSearch = (event) => {
    event.preventDefault()
    const input = this.refs.search
    this.props.search(input.value)
    this.setState({init: true})
    input.value = ''
  }
  handleFeedState = (event) => {
    this.props.changeState(event.target.dataset.type)
  }
  handleRefresh = (event) => {
    this.props.refresh(this.props.user)
  }
  loadContent = (title, index) => {
    this.props.getContent(this.props.user, title, index)
  }
  readContent = (id, index) => {
    if(!this.props.contents[index].rd) {
      this.props.contents[index].rd = true
      this.props.contentSelect(index)
      this.props.markReaded(this.props.user,id)
    } else if(index !== this.props.entryIndex){
      this.props.contentSelect(index)
    }
  }
  handleMark = (title, event) => {
    // this.props.markReaded(this.props.user, title)
    // this.props.drop(false)
  }
  handleMouseDown = (event) => {
    // var domNode = this.refs.feedList
    // var refreshing = this.refs.refreshing
  }
  handleMouseUp = (event) => {

  }
  handleMouseMove = (event) => {

  }
  render() {
    const styles = require('./Center.less')
    const {loading, user, contents, list, addone, selected, status, coor, entryIndex} = this.props
    return (
      <div className={styles.feedcenter}>
        <div className={styles.feeds}>
          <div className={styles.searchBar}>
            <form onSubmit={this.handleSearch}>
              <input type='text' ref="search" placeholder="search"/>
            </form>
          </div>
          <div className={styles.feedList} ref="feedList"
               onMouseDown={this.handleMouseDown}
               onMouseUp={this.handleMouseUp}
               onMouseMove={this.handleMouseMove}>
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
            <span className="fa fa-refresh" onClick={this.handleRefresh}></span>
          </div>
        </div>
        <div className={styles.column}>
          <div className={styles.feedState} onClick={this.handleFeedState}>
            {
              [['fa fa-star', 'starred'],
              ['fa fa-circle', 'unread'],
              ['fa fa-align-left', 'all']].map((item, index) => {
                var mask = item[1] === status ? styles.feedmask : ''
                return (
                  <span key={`state.${index}`} className={`${item[0]} ${mask}`} data-type={item[1]}></span>
                )
              })
            }
          </div>
          <div className={styles.itemList}>
            <ul>
              {contents && contents.map((item, index) => {
                switch (status) {
                  case 'unread':
                    if(item.rd && entryIndex !== index) {
                      return
                    }
                    break
                  case 'starred':
                    if(!item.st) {
                      return
                    }
                    break
                  default:
                    break
                }
                item.con = item.con.replace(/<h\d>.*?<\/h\d>/, '')
                var header = item.con.replace(/<.*?>/g, '')
                var time = new Date(item.pub)
                var timeString = time.toLocaleTimeString()
                var dateString = time.toLocaleDateString()
                var readMark = item.rd ? styles.readMark : ''
                var selected = entryIndex === index ? styles.reading : ''
                return (
                  <li key={`item.${index}`} onClick={this.readContent.bind(this, item._id, index)}
                        className={`${readMark} ${selected}`}>
                    <div className={styles.timestamp}>
                      <span>{dateString}</span>
                      <span>{timeString}</span>
                    </div>
                    <div className={styles.listTitle}>{item.tt}</div>
                    <div className={styles.listContent}>{header}</div>
                    <div className={styles.source}>{item.fnm}</div>
                  </li>
                )
              })}
            </ul>
          </div>
          <div className={styles.mark} onClick={this.handleMark.bind(this,selected[0])}>
            Mark all as read
          </div>
        </div>
        <ContentPenal/>
        {this.state.init && <SearchPanel />}
      </div>

    )
  }
}
