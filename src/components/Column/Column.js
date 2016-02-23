import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'

import {markReaded, markAllReaded ,contentSelect} from 'redux/modules/manage'
import {changeState} from 'redux/modules/stat'

@connect(state => ({
  user: state.auth.user,
  contents: state.manage.contents,
  selected: state.manage.selected,
  status: state.stat.status,
  entryIndex:state.manage.entryIndex
}), { markReaded, markAllReaded, contentSelect, changeState })
export default class Column extends Component {
  static propTypes = {
    user: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    contents: PropTypes.array,
    selected: PropTypes.array,
    entryIndex: PropTypes.number,
    markReaded: PropTypes.func.isRequired,
    markAllReaded: PropTypes.func.isRequired,
    contentSelect: PropTypes.func.isRequired,
    changeState: PropTypes.func.isRequired,
  }
  handleFeedState = (event) => {
    this.props.changeState(event.target.dataset.type)
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
    this.props.markAllReaded(this.props.user, title)
    this.contents.map((item) => {
      item.rd = true
    })
  }
  render() {
    const styles = require('./Column.less')
    const {contents, selected, status, entryIndex} = this.props
    return (
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
      </div>
    )
  }
}
