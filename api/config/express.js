"use strict";

import bodyParser from 'body-parser'
import session from 'express-session'
import * as actions from '../actions/index';
import {mapUrl} from '../utils/url.js';

var env = process.env.NODE_ENV || 'development';

module.exports = function (app, express, passport) {
  // settings
  app.set('env', env);

  app.use(session({
    secret: 'react and redux rule!!!!',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000 }
  }));
  app.use(bodyParser.json());

  app.use((req, res) => {
    console.log(req.url);
    const splittedUrlPath = req.url.split('?')[0].split('/').slice(1);
    // const splittedUrlPath = req.url.split('?')[0]
    const {action, params} = mapUrl(actions, splittedUrlPath);
    console.log(action)
    console.log(params);
    console.log('end!~~~!~');
    if (action) {
      action(req, params)
        .then((result) => {
          if (result instanceof Function) {
            result(res);
          } else {
            console.log('result::');
            // console.log(result);
            res.json(result);
          }
        }, (reason) => {
          console.log('error~~!~~');
          console.log(reason);
          if (reason && reason.redirect) {
            res.redirect(reason.redirect);
          } else {
            console.log(`API ERROR ${reason}`);
            // console.error('API ERROR:', pretty.render(reason));
            res.status(reason.status || 500).json(reason);
          }
        });
    } else {
      res.status(404).end('NOT FOUND');
    }
  });
}
