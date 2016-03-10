import React, { Component, PropTypes } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { connect } from 'react-redux'
import { getFeeds } from 'redux/modules/manage'
import {SearchPanel, ContentPenal, Column, FeedTab} from 'components'

@connect(state => ({user: state.auth.user}), {getFeeds})
export default class Home extends Component {
  static propTypes = {
    user: PropTypes.string.isRequired,
    getFeeds: PropTypes.func.isRequired
  }
  componentDidMount() {
    this.props.getFeeds(this.props.user)
  }
  render() {
    const styles = require('./Center.scss')
    return (
      <div className={styles.feedcenter}>
        <FeedTab />
        <Column />
        <ContentPenal/>
        <SearchPanel />
      </div>
    )
  }
}
