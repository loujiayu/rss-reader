import request from 'superagent'
var mongoose = require('mongoose');
var btoa = require('btoa');
var User = mongoose.model('User');
var Feed = mongoose.model('Feed');

const access_token = 'AzepBSVkqpwOvjrLhP0XwZFiJy36eLZnMnhrnykT3BYOHV_BYxRZuqjzGNLKvqV7GB1C1YYPYV83oofhyjXoLhfWhzIa4vGNRiXbboul0dAWxl_Mv7Xkc_33KLSsbITnpdwPEKLXagcB95vZx3UJSqbUVfUHhYZ7pmy5Y6jFy5N08ki0sG7Llv0hRt6M-CcG8YcY-EgaSnyWQi2DgPnmEnTRWKdDQqSe:sandbox'
// import {stream} from '../actions/feed'

var continuation = ''
var now = Date.parse(Date())/1000

function fetchNew(item) {
  return item.published > now-86400*3
}

export function fetchDataUrl(ref) {
  return new Promise((resolve, reject) => {
    request.get(ref)
           .timeout(10000)
           .end((err, {body} = {}) => {
             if(!body) {
               reject('empty body')
             } else {
               var arr = new Uint8Array(body)
               // Maximum call stack size exceeded bug fixed
               var strings = [],chunksize = 0xffff
               for(var i=0;i*chunksize < arr.length; ++i) {
                 strings.push(String.fromCharCode.apply(null, arr.subarray(i * chunksize, (i + 1) * chunksize)))
               }
               var dataURL="data:image/jpeg;base64,"+btoa(strings.join(''))
               resolve(dataURL)
             }
           })
  })
}

async function toDataUrl(str) {
  var links = str.match(/src=\"(.*?)\"/g)
  console.log(`links number ${links}`);
  for(let i = 0;links && i < links.length; ++i) {
    var r = links[i].match(/http.*.(jpg|png)/)
    if(!r) {
      continue
    } else {
      r = r[0]
    }
    var dataURL = await fetchDataUrl(r)
    str = str.replace(r, dataURL)
  }
  return str
}

async function presave(contents) {
  try {
    for(let i=0;i<contents.length;++i) {
      contents[i].con = await toDataUrl(contents[i].con)
    }
  } catch (err) {
    console.log(err);
  }
  return contents
}

function fetchContent(feedId) {
  return new Promise((resolve, reject) => {
    request.get(`https://sandbox.feedly.com/v3/streams/contents`)
        .query({count: 10, streamId:feedId, continuation:continuation})
        .set('Authorization', 'OAuth '+ access_token)
        .end((err, {body} = {}) => {
          if(err) {
            reject(body || err)
          } else {
            var filtered = body.items.filter(fetchNew)
            console.log(`filtered.length ${filtered.length}`);
            var filtered = filtered.map((item) => {
              return {con: item.summary.content, pub: item.published, tt: item.title, oId: item.originId, rd: false, st: false}
            })
            resolve(filtered)
          }
        })
  })
}

export async function getNewFeeds(feedId) {
  var block = []
  try {
    for(let i = 0; i < 1; ++i) {
      var newFeed = await fetchContent(feedId)
      block = block.concat(newFeed)
    }
  } catch(err) {
    console.log(err);
  }
  return block
}

export function refresh(username, feedId) {
  now = Date.parse(Date())/1000
  Feed.findOne({name: username, feedId: feedId}, (err, profile) => {
    getNewFeeds(feedId).then((newFeeds) => {
      var list = profile.feedList
      list = list.filter(fetchNew)
      profile.feedList = newFeeds.concat(list)
      profile.save()
    })
  })
}
