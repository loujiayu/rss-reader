var path = require('path')

module.exports = [
  {
    pattern: 'api/([a-z]+)',
    fixtures: function(match, params, headers) {
      if(match[1] === 'search') {
        var feeds = require('./mock/feeds.json')
        return feeds
      }
      if(match[1] === '') {
        // var 
      }
    },
    get: function (match, data) {
      return {
        body: data
      }
    }
  }
]
