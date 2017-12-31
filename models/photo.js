const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt')
mongoose.connect('mongodb://localhost:27017/jepret')
mongoose.Promise = global.Promise;

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
  caption : String,
}, { timestamps : {} })
module.exports = mongoose.model('Photo', photoSchema)