import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'

import { SnackBar } from 'components'
import {markReaded, markAllReaded ,contentSelect} from 'redux/modules/manage'
import {changeState} from 'redux/modules/stat'
import {contentSwitch, tabSwitch} from 'redux/modules/media'

@connect(state => ({
  user: state.auth.user,
  contents: state.manage.contents,
  selected: state.manage.selected,
  status: state.stat.status,
  entryIndex:state.manage.entryIndex,
  view: state.media.view,
  mode: state.stat.mode
}), { markReaded, markAllReaded, contentSelect, changeState,
      contentSwitch, tabSwitch})
export default class Column extends Component {
  constructor() {
    super()
    this.state = {
      feedListShow: false
    }
  }
  static propTypes = {
    user: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    contents: PropTypes.array,
    selected: PropTypes.array,
    entryIndex: PropTypes.number,
    view: PropTypes.string.isRequired,
    markReaded: PropTypes.func.isRequired,
    markAllReaded: PropTypes.func.isRequired,
    contentSwitch: PropTypes.func.isRequired,
    tabSwitch: PropTypes.func.isRequired,
    contentSelect: PropTypes.func.isRequired,
    changeState: PropTypes.func.isRequired,
    mode: PropTypes.bool.isRequired
  }
  handleFeedState = (event) => {
    this.props.changeState(event.target.dataset.type)
  }
  readContent = (id, index) => {
    this.props.contentSwitch()
    if(!this.props.contents[index].rd) {
      this.props.contents[index].rd = true
      this.props.contentSelect(index)
      this.props.markReaded(this.props.user,id)
    } else if(index !== this.props.entryIndex){
      this.props.contentSelect(index)
    }
  }
  handleMark = (title, event) => {
    this.props.markAllReaded(this.props.user, title)
    if(this.props.contents) {
      this.props.contents.map((item) => {
        item.rd = true
      })
    }
  }
  handleBack = () => this.props.tabSwitch()

  render() {
    const styles = require('./Column.scss')
    const {contents, selected, status, entryIndex, mode, view} = this.props
    var media
    switch (view) {
      case 'FEEDTAB':
        media = styles.tabDelayRes
        break
      case 'COLUMN':
        media = ''
        break
      case 'CONTENT':
        media = styles.conDelayRes
        break
      default:
        break
    }
    return (
      <div className={`${styles.column} ${media}`}>
        <div className={styles.columnHeader}>
          <div className={`${styles.back} fa fa-chevron-left fa-lg`} onClick={this.handleBack}></div>
        </div>
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
              var header = item.con.replace(/<.*?>/g, '')
              var time = new Date(item.pub)
              var timeString = time.toLocaleTimeString()
              var dateString = time.toLocaleDateString()
              var readMark = item.rd ? styles.readMark : ''
              var target = entryIndex === index ? styles.reading : ''
              return (
                <li key={`item.${index}`} onClick={this.readContent.bind(this, item._id, index)}
                      className={`${readMark} ${target}`}>
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
        <SnackBar message="Marked as read"/>
      </div>
    )
  }
}
