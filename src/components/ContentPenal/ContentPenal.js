import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import {star} from 'redux/modules/manage'
import {changeMode} from 'redux/modules/stat'
import {columnSwitch} from 'redux/modules/media'


@connect(state => ({entryIndex:state.manage.entryIndex,
                    contents: state.manage.contents,
                    user: state.auth.user,
                    view: state.media.view,
                    mode: state.stat.mode}),
                  {star, changeMode, columnSwitch})
export default class ContentPenal extends Component {
  constructor() {
    super()
    this.state = {
      fade: true,
      lastScrollTop: 0
    }
  }
  static propTypes = {
    columnSwitch: PropTypes.func.isRequired,
    entryIndex: PropTypes.number,
    contents: PropTypes.array,
    view: PropTypes.string.isRequired,
    mode: PropTypes.bool.isRequired
  }
  handleScroll = (event) => {
    var st = event.target.scrollTop
    if(st > this.state.lastScrollTop) {
      // down
      this.setState({fade: false})
    } else {
      // up
      this.setState({fade: true})
    }
    this.setState({lastScrollTop: st})
  }
  handleStar = (flag, index) => this.props.star(flag,index, this.props.user)
  changeMode = () => this.props.changeMode()
  handleBack = () => this.props.columnSwitch()
  render() {
    const styles = require('./ContentPenal.less')
    const {entryIndex, contents, view} = this.props
    var entryBarStyle = this.state.fade ? styles.fadeInDown : styles.fadeInUp
    if(entryIndex !== -1) {
      var item = contents[entryIndex]
      var starredIcon = item.st ? 'fa fa-star fa-lg' : 'fa fa-star-o fa-lg'
      var topicon = item.fnm
    }
    var media

    switch (view) {
      case 'FEEDTAB':
        media = styles.immedRes
        break
      case 'COLUMN':
        media = styles.immedRes
        break
      case 'CONTENT':
        media = ''
        break
      default:
        break
    }
    return (
      <div className={`${styles.entry} ${media}`} onScroll={this.handleScroll}>
        {entryIndex!==-1 &&
          <div>
            <div className={styles.ske}></div>
            <nav className={`${styles.floatingBar} ${entryBarStyle}`}>
              <div className={styles.barSource}>{item.fnm}</div>
              <div className={`${styles.back} fa fa-chevron-left fa-lg`} onClick={this.handleBack}></div>
              <i className="fa fa-book fa-lg" onClick={this.changeMode}></i>
              <div className={styles.toolCollect}>
                <span className={starredIcon} onClick={this.handleStar.bind(item.st, item._id)}></span>
                <span className="fa fa-external-link fa-lg"></span>
              </div>
            </nav>
            <div className={styles.header}><h2>{item.tt}</h2></div>
            <div className={styles.contents}
               dangerouslySetInnerHTML={{__html:item.con} }>
            </div>
          </div>}
      </div>
    )
  }
}
