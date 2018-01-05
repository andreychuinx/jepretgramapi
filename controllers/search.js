const express = require('express')
const ruouter = express.Router()
const PhotoModel = require('../models/photo')
const UserModel = require('../models/user')
const HttpStatus = require('http-status-codes')
const ObjectID = require('mongodb').ObjectID

class SearchController {
  static getSearch(req, res) {
    let regex = new RegExp(req.params.search, 'i')
    console.log(req.decoded)
    Promise.all([
      UserModel.find({
        _id : {
          $ne : req.decoded.userId
        },
        $or: [
          {name : regex},
          {username : regex}
        ]
      })
      .populate('follows')
      .exec(),
      PhotoModel.find({
        $or: [
          {caption : regex}
        ]
      })
      .populate('userId')
      .populate('likes')
      .populate('comments._id')
      .exec()
    ])
    .then(([resultUser, resultPhoto]) =>{
      res.status(HttpStatus.OK).json({
        messages: "Data Search",
        data : {
          user : resultUser,
          photo : resultPhoto
        }
      })
    })
    .catch(([errUser, errPhoto]) =>{
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        messages: "Data Photo Error",
        data: {
          user : errUser,
          photo : errPhoto
        },
        error: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR)
      })
    })
  }
}

module.exports = SearchController