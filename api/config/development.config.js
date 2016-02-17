"use strict";

module.exports = function (ROOT_PATH) {
  var config = {
    server: {
      port: 3001,
      hostname: 'localhost',
    },
    database: {
      url: 'mongodb://localhost/feedly'
    },
    BaseApiURL : 'http://localhost:3001/api/',
    root     : ROOT_PATH,
    app      : {
      name : 'Express4-Bootstrap-Starter'
    },
    mailgun: {
      user: process.env.MAILGUN_USER || 'postmaster@sandbox49936.mailgun.org',
      password: process.env.MAILGUN_PASSWORD || '1fq8qzwl14w8'
    },
    phamtom : {
      retries: 2,
      width       : 1280,
      height      : 800,
      maxRenders: 50
    }
  }
  return config;
}
