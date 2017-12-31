const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt')
mongoose.connect('mongodb://localhost:27017/jepret')
mongoose.Promise = global.Promise;

var userSchema = new Schema({
  name : String,
  username : {
    type : String,
    unique : true
  },
  email : {
    type : String,
    unique : true
  },
  password : String,
  follows : [{
    userId : {
      type : Schema.Types.ObjectId,
      ref : 'User'
    }
  }]
}, { timestamps : {} })

userSchema.pre('save', function (next) {
  bcrypt.hash(this.password, 10)
  .then(hash =>{
    this.password = hash
    next()
  })
  .catch(err => next(err))
})

userSchema.methods.comparePassword = function (passInput) {
  return new Promise((resolve, reject) =>{
    bcrypt.compare(passInput,this.password)
    .then(isMatch =>{
      resolve(isMatch)
    })
    .catch(err =>{
      reject(err)
    })
  })
  
}

module.exports = mongoose.model('User', userSchema)