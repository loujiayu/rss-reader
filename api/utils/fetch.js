import request from 'superagent'
var mongoose = require('mongoose');
// var btoa = require('btoa');
var User = mongoose.model('User');
var Feed = mongoose.model('Feed');

const access_token = 'AzepBSVkqpwOvjrLhP0XwZFiJy36eLZnMnhrnykT3BYOHV_BYxRZuqjzGNLKvqV7GB1C1YYPYV83oofhyjXoLhfWhzIa4vGNRiXbboul0dAWxl_Mv7Xkc_33KLSsbITnpdwPEKLXagcB95vZx3UJSqbUVfUHhYZ7pmy5Y6jFy5N08ki0sG7Llv0hRt6M-CcG8YcY-EgaSnyWQi2DgPnmEnTRWKdDQqSe:sandbox'
// import {stream} from '../actions/feed'

var continuation = ''
var now = Date.parse(Date())

function fetchNew(item) {
  console.log(item.published);
  console.log(now);
  return item.published > now-86400000*3
}
//
// export function fetchDataUrl(ref) {
//   return new Promise((resolve, reject) => {
//     request.get(ref)
//            .timeout(10000)
//            .end((err, {body} = {}) => {
//              if(!body) {
//                reject('empty body')
//              } else {
//                var arr = new Uint8Array(body)
//                // Maximum call stack size exceeded bug fixed
//                var strings = [],chunksize = 0xffff
//                for(var i=0;i*chunksize < arr.length; ++i) {
//                  strings.push(String.fromCharCode.apply(null, arr.subarray(i * chunksize, (i + 1) * chunksize)))
//                }
//                var dataURL="data:image/jpeg;base64,"+btoa(strings.join(''))
//                resolve(dataURL)
//              }
//            })
//   })
// }
//
// async function toDataUrl(str) {
//   var links = str.match(/src=\"(.*?)\"/g)
//   console.log(`links number ${links}`);
//   for(let i = 0;links && i < links.length; ++i) {
//     var r = links[i].match(/http.*.(jpg|png)/)
//     if(!r) {
//       continue
//     } else {
//       r = r[0]
//     }
//     var dataURL = await fetchDataUrl(r)
//     str = str.replace(r, dataURL)
//   }
//   return str
// }
//

async function presave(contents) {
  var results = []
  var item
  try {
    for(let i=0;i<contents.length;++i) {
      item = contents[i]
      console.log(item);
      var data = await Feed.findOne({_id: item.id})
      if(!data) {
        item.summary.content = item.summary.content.replace(/<h\d>.*?<\/h\d>/, '')
        results.push({con: item.summary.content, pub: item.published, tt: item.title,
          oId: item.originId, rd: false, st: false, _id:item.id, fId: item.origin.streamId,fnm: item.origin.title})
      }
    }
  } catch (err) {
    console.log(err)
  }
  return results
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
            continuation = body.continuation
            // var filtered = body.items
            console.log(`filtered.length ${filtered.length}`);
            console.log(filtered);
            presave(filtered).then((results) => {
              resolve(results)
            })
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
      if(newFeed.length !== 10) {
        break
      }
    }
  } catch(err) {
    console.log(err);
  }
  return block
}

export async function feedsRefresh(username) {
  now = Date.parse(Date()) / 1000
  var block = []
  var unreadCount = {}
  try {
    var profile = await User.findOne({nm: username})
    for(let i=0;i<profile.fs.length;++i) {
      var item = profile.fs[i]
      unreadCount[item.f] = 0
      while(true) {
        var feeds = await fetchContent(item.fr)
        block = block.concat(feeds)
        unreadCount[item.f] += feeds.length
        console.log(`feedsRefresh ${feeds.length}`);
        console.log(`block ${block.length}`);
        if(feeds.length !== 10) {
          break
        }
      }
    }
  } catch(err) {
    console.log(err);
  }
  // console.log(`block ${block.length}`);
  return {feeds: block, ct: unreadCount}
}