var mongoose = require('mongoose');
var Schema = mongoose.Schema

// fId, con, pub, oId
// nm, pw, tt, fnm
var feedSchema = new Schema({
  nm:{
    type:String,
    require: true,
    index: true
  },
  fId: {
    type:String,
    require: true,
    index:true
  },
  tt: {
    type: String
  },
  rd: {
    type: Boolean
  },
  st: {
    type: Boolean
  },
  fnm: {
    type: String,
    require: true,
    index: true
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

module.exports = mongoose.model('Feed', feedSchema)
