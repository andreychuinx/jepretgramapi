const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt')

var photoSchema = new Schema({
  name : String,
  link : String,
  userId : {
    type : Schema.Types.ObjectId,
    ref : 'User'
  },
  likes : [{
    type : Schema.Types.ObjectId,
    ref : 'User'
  }],
  comments : [{
    _id : {
      type : Schema.Types.ObjectId,
      ref: 'User'
    },
    comment : String,
    createdComment : {
      type : Date,
      default : Date.now
    }
  }],
  caption : String,
}, { timestamps : {} })
module.exports = mongoose.model('Photo', photoSchema)