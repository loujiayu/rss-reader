import request from 'superagent'
var mongoose = require('mongoose');
// var btoa = require('btoa');
var User = mongoose.model('User');
var Feed = mongoose.model('Feed');

const access_token = 'A3q8IovwlwdBHz413omUSTLM7yrSpRqKkSSHufiJsvveBgeno1j978QlnBAkhuKFySyFP8TwB-KLKTcRIS7g599-rxkE8uZxVY2PCHMierorbFLWwps-GpisG21-eAdP1YKYd7j97rcRGYklNxqX76_MwnAjrlxQjZ79zv9kIo_CVo-65Po8ld8PeZdbklItjVtIrGIZOqTgCdc39p-QBQzndunp5tE3:sandbox'
// import {stream} from '../actions/feed'

var continuation = ''
var now = Date.parse(Date())

function fetchNew(item) {
  return item.published > now-86400000*3
}

async function presave(contents, name) {
  var feeds = []
  var cts = []
  var item
  try {
    for(let i=0;i<contents.length;++i) {
      item = contents[i]
      var data = await Feed.findOne({sId: item.id, nm: name})
      console.log(`presave find data ${data}`);
      if(!data) {
        item.summary.content = item.summary.content.replace(/<h\d>.*?<\/h\d>/, '')
        var id = item.id.split('=')[1].replace(/\_|\:/g,'')
        cts.push({con: item.summary.content, pub: item.published, _id: id, tt: item.title, oId: item.originId})
        feeds.push({nm:name, pub: item.published, rd: false, st: false, sId: id, fId: item.origin.streamId,fnm: item.origin.title})
      }
    }
  } catch (err) {
    console.log(err)
  }
  // console.log(cts);
  return {fd: feeds, cts: cts}
}

function fetchContent(feedId, name) {
  return new Promise((resolve, reject) => {
    request.get(`https://sandbox.feedly.com/v3/streams/contents`)
        .query({count: 10, streamId:feedId, continuation:continuation})
        .set('Authorization', 'OAuth '+ access_token)
        .end((err, {body} = {}) => {
          if(err) {
            reject(body || err)
          } else {
            var filtered = body.items.filter(fetchNew)
            continuation = body.continuation
            // var filtered = body.items
            console.log(`filtered.length ${filtered.length}`);
            // console.log(filtered);
            presave(filtered, name).then((results) => {
              resolve(results)
            })
          }
        })
  })
}

export async function getNewFeeds(feedId, name) {
  var fd = []
  var cts = []
  try {
    for(let i = 0; i < 1; ++i) {
      var newFeed = await fetchContent(feedId, name)
      console.log(newFeed.fd);
      fd = fd.concat(newFeed.fd)
      cts = cts.concat(newFeed.cts)
      if(newFeed.fd.length !== 10) {
        break
      }
    }
    continuation = ''
  } catch(err) {
    console.log(err);
  }
  // console.log(`getNewFeeds ${fd}`);
  return {fd: fd, cts: cts}
}

export async function feedsRefresh(username) {
  now = Date.parse(Date()) / 1000
  // var block = []
  var fd = []
  var cts = []
  var unreadCount = {}
  try {
    var profile = await User.findOne({nm: username})
    for(let i=0;i<profile.fs.length;++i) {
      var item = profile.fs[i]
      unreadCount[item.f] = 0
      while(true) {
        var feeds = await fetchContent(item.fr)
        fd = fd.concat(feeds.fd)
        cts = cts.concat(feeds.cts)
        // block = block.concat(feeds)
        unreadCount[item.f] += feeds.length
        if(feeds.fd.length !== 10) {
          break
        }
      }
      continuation = ''
    }
  } catch(err) {
    console.log(err);
  }
  // console.log(`block ${block.length}`);
  return {feeds: {fd: fd, cts: cts}, ct: unreadCount}
}
