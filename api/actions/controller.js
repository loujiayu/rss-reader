var mongoose = require('mongoose')
var Feed = mongoose.model('Feed')
var User = mongoose.model('User')
var Content = mongoose.model('Content')
import {getNewFeeds, feedsRefresh} from '../utils/fetch.js';

function dataInsert(block) {
  Feed.insertMany(block.fd, (err, docs) => {
    console.log(err)
  })
  block.cts.forEach((item, index) => {
    Content.findOne({_id: item._id}, (err, doc) => {
      if(!doc) {
        Content.create(item)
      }
    })
  })
}

export async function subscribe(req) {
  const {name, rss} = req.body
  const {feedId, title, website} = rss
  var icon = `https://www.google.com/s2/favicons?domain=${website}&alt=feed`
  try {
    var newFeeds = await getNewFeeds(feedId, name)
    console.log(newFeeds);
    console.log(`newFeeds fd length is ${newFeeds.fd.length}`);
    if(newFeeds.fd.length === 0) {
      Feed.create({nm: name, fId: feedId, fnm: title})
    } else {
      User.update({nm: name}, {$push: {fs:{f:title,ct: newFeeds.fd.length, fr: feedId, ic:icon}}},(err, fb) => {
        console.log(err)
        console.log(fb)
      })
      dataInsert(newFeeds)
    }
    return title
  } catch(err) {
    console.log(err);
  }

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
  dataInsert(feeds)
  // var promises = feeds.map((feed,index) => {
  //   let target = {}
  //   Object.assign(target, {nm: name}, feed)
  //   Feed.create(target)
  // })
  return profile.js
}

export async function markall(req) {
  const {name, title} = req.query
  await User.update({nm:name, "fs.f":title}, {$set:{"fs.$.ct":0}}).exec()
  var profile = await User.findOne({nm:name}).exec()
  Feed.update({nm:name, fnm:title}, {$set:{rd: true}}, {multi:true}).exec()
  return profile.fs
}

export async function mark(req) {
  const {index, name} = req.query
  var doc = await Feed.findOne({sId: index, nm:name}).exec()
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

export async function feedcontent(req) {
  const {name, title} = req.query
  var item, article, results = []
  var list = await Feed.find({nm: name, fnm: title}).exec()
  for(let i=0; i < list.length; ++i) {
    item = list[i]
    // results[i].sId
    article = await Content.findOne({_id: item.sId}).exec()
    results.push(Object.assign(article, {rd: item.rd, st: item.st, fId: item.fId, fnm:item.fnm}))
  }
  return results
}

export function star(req) {
  const {index, flag, name} = req
  return new Promise((resolve, reject) => {
    Feed.findOne({sId: index, nm:name}, (err, doc) => {
      doc.st = flag
      doc.save()
    })
  })
}
