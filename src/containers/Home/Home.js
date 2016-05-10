import React, { Component } from 'react';

export default class Home extends Component {
  render() {
    const styles = require('./Home.scss')

    return(
      <div className={styles.home}>
        <div className={styles.wrapper}>
          <div>
            simple RSS reader
          </div>
          <button className='btn btn-default'>LOGIN</button>

        </div>
      </div>
    )
  }
}
