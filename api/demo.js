// Module dependencies
require('../server.babel');
var path     = require('path');
var fs       = require('fs');
var express  = require('express');
var mongoose = require('mongoose');
// var passport = require('passport');
var config   = require(__dirname + '/config/config');
var app      = express();

app.config = config;
require('./config/database')(app, mongoose);

var models_path = __dirname + '/models'
fs.readdirSync(models_path).forEach(function (file) {
  if (~file.indexOf('.js')) require(models_path + '/' + file)
});
var feedId = 'feed/http://feeds.feedburner.com/zhihu-daily'
var getNewFeeds = require('./utils/refresh').getNewFeeds
var Feed = mongoose.model('Feed');

// getNewFeeds(feedId).then((newFeeds) => {
//   Feed.create({name: 'name', feedId: feedId, feedList: newFeeds}, (err, small) => {
//     console.log(small);
//   })
// })
Feed.create({name: 'ljy2', unreadCt:0})
// Feed.findOne({name: 'ljy', feedId: feedId}, 'feedList',function(err, doc) {
//   // doc.feedList[2].unread = false
//   // doc.markModified('feedList')
//   console.log(doc);
//   doc.save()
// })
// Feed.create({name:'ljy',feedId: 'Ob', title:'知乎'})
// Feed.find({name: 'ljy'}, (err, obj) => {
//   console.log(obj);
// })
