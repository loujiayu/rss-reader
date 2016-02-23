var mongoose = require('mongoose');
var Schema = mongoose.Schema

// fId, con, pub, oId
// nm, pw, tt, fnm
var contentSchema = new Schema({
  _id: {
    type:String,
    require: true,
    index: true
  },
  tt: {
    type: String
  },
  con:{
    type: String,
  },
  pub: {
    type: Number,
  },
  oId: {
    type: String
  }
})

module.exports = mongoose.model('Content', contentSchema)
