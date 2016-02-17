var mongoose = require('mongoose');
var Schema = mongoose.Schema

var userSchema = new Schema({
  nm:{
    type:String,
    require: true,
    index: true
  },
  pw: {
    type:String,
    require: true
  },
  fs: [Schema.Types.Mixed]
})

module.exports = mongoose.model('User', userSchema)
