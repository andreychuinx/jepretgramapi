const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt')
mongoose.connect('mongodb://localhost:27017/jepret')
mongoose.Promise = global.Promise;

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