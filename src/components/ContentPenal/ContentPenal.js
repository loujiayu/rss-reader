import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import {star} from 'redux/modules/manage'

@connect(state => ({entryIndex:state.manage.entryIndex,
                    contents: state.manage.contents}),
                  {star})
export default class ContentPenal extends Component {
  constructor() {
    super()
    this.state = {
      fade: true,
      lastScrollTop: 0
    }
  }
  static propTypes = {
    entryIndex: PropTypes.number,
    contents: PropTypes.object
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
  handleStar = (flag, index) => {
    this.props.star(flag,index)
  }
  render() {
    const styles = require('./ContentPenal.less')
    const {entryIndex, contents} = this.props
    var entryBarStyle = this.state.fade ? styles.fadeInDown : styles.fadeInUp
    if(entryIndex !== -1) {
      var item = contents[entryIndex]
      // item.con += '<img width="50" height="50" src="http://jmperezperez.com/assets/images/posts/svg-inline-html-use.png"></img>'
      var starredIcon = item.st ? 'fa fa-star fa-lg' : 'fa fa-star-o fa-lg'
    }
    return (
      <div className={styles.entry} onScroll={this.handleScroll}>

        {entryIndex!==-1 &&
          <div>
            <div className={styles.ske}></div>
            <nav className={`${styles.floatingBar} ${entryBarStyle}`}>
              <div className={styles.barSource}>{item.fnm}</div>
              <div className={styles.toolCollect}>
                <span className={starredIcon} onClick={this.handleStar.bind(item.st, item._id)}></span>
                <span className="fa fa-external-link fa-lg"></span>
              </div>
            </nav>
            <div className={styles.header}><h2>{item.tt}</h2></div>
            {/*<img width="50" height="50" src="http://jmperezperez.com/assets/images/posts/svg-inline-html-use.png"></img>*/}
            <div className={styles.contents}
               dangerouslySetInnerHTML={{__html:item.con} }>
            </div> </div>}
      </div>
    )
  }
}
