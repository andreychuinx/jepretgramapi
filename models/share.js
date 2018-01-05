const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt')

var shareSchema = new Schema({
  idPhoto : {
    type : Schema.Types.ObjectId,
    ref : 'Photo'
  },
  userShared : {
    type : Schema.Types.ObjectId,
    ref : 'User'
  },
  captions : String
}, { timestamps : {} })


module.exports = mongoose.model('Share', shareSchema)