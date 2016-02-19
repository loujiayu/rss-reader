var mongoose = require('mongoose');
var Feed = mongoose.model('Feed');
var User = mongoose.model('User')
import {getNewFeeds, feedsRefresh} from '../utils/fetch.js';

export function subscribe(req) {
  const {name, rss} = req.body
  const {feedId, title, website} = rss
  var icon = `https://www.google.com/s2/favicons?domain=${website}&alt=feed`
  return new Promise((resolve, reject) => {
    getNewFeeds(feedId).then((newFeeds) => {
      resolve(title)
      console.log(newFeeds.length);
      if(newFeeds.length === 0) {
        Feed.create({nm: name, fId: feedId, fnm: title})
      }
      User.update({nm: name}, {$push: {fs:{f:title,ct: newFeeds.length, fr: feedId, ic:icon}}},(err, fb) => {
        console.log(err)
        console.log(fb)
      })
      newFeeds.forEach((feed, index) => {
        let target = {}
        Object.assign(target, {nm: name}, feed)
        Feed.create(target)
      })
    })
  })
}

export async function refresh(req) {
  const {name} = req.query
  var results = await feedsRefresh(name)
  const {feeds, ct} = results
  console.log(ct);
  for(let [key, val] of Object.entries(ct)){
    await User.update({nm:name, "fs.f":key}, {$inc:{"fs.$.ct":val}}).exec()
  }
  var profile = await User.findOne({nm:name}).exec()
  var promises = feeds.map((feed,index) => {
    let target = {}
    Object.assign(target, {nm: name}, feed)
    Feed.create(target)
  })
  // Promise.all(promises)
  console.log(`feeds ${feeds.length}`);
  // feeds.forEach((feed, index) => {
  //   let target = {}
  //   Object.assign(target, {nm: name}, feed)
  //   Feed.create(target)
  // })
  return profile.js
}

export async function mark(req) {
  const {index, name} = req.query
  var doc = await Feed.findOne({_id: index}).exec()
  doc.rd = true
  console.log(doc.fnm);
  doc.save()
  await User.update({nm:doc.nm, "fs.f":doc.fnm}, {$inc:{"fs.$.ct":-1}}).exec()
  var profile = await User.findOne({nm:name}).exec()
  return profile.fs
}

export function feedlist(req) {
  const {name} = req.query
  return new Promise((resolve, reject) => {
    User.findOne({nm:name}, (err, profile) => {
      console.log(profile)
      resolve(profile.fs)
    })
  })
}

export function feedcontent(req) {
  const {name, title} = req.query
  return new Promise((resolve, reject) => {
    Feed.find({nm: name, fnm: title},null, (err, results) => {
      results.length === 0 ? reject('wrong index') : resolve(results)
    })
  })
}

export function star(req) {
  const {index, flag} = req
  return new Promise((resolve, reject) => {
    Feed.findOne({_id: index}, (err, doc) => {
      doc.st = flag
      doc.save()
    })
  })
}
