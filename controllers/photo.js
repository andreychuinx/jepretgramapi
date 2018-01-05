const express = require('express');
const router = express.Router();
const PhotoModel = require('../models/photo')
const UserModel = require('../models/user')
const HttpStatus = require('http-status-codes')
const ObjectID = require('mongodb').ObjectID;

class PhotoController {
  static get(req, res) {
    PhotoModel.find()
      .populate('userId')
      .exec()
      .then(result => {
        res.status(HttpStatus.OK).json({
          messages: "Data Photos",
          data: result
        })
      })
      .catch(err => {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
          messages: "Data Photos Error Server",
          data: err,
          error: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR)
        })
      })
  }

  static getTimeline(req, res) {
    UserModel.findById(req.decoded.userId)
      .populate('follows')
      .exec()
      .then(dataUser => {
        PhotoModel.find({
          $or: [
            { userId: dataUser._id },
            { userId: dataUser.follows }
          ]
        })
          .sort({ createdAt: 'desc' })
          .populate('userId')
          .populate('likes')
          .populate('comments._id')
          .exec()
          .then(dataPhoto => {
            res.status(HttpStatus.OK).json({
              messages: "Data Photos",
              data: dataPhoto
            })
          })
      })

  }

  static getSingle(req, res) {
    PhotoModel.findById(req.params.id)
      .then(result => {
        res.status(HttpStatus.OK).json({
          messages: "Data Single Photo",
          data: result
        })
      })
      .catch(err => {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
          messages: "Data Photo Error",
          data: err,
          error: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR)
        })
      })
  }

  static create(req, res) {
    console.log(req.file)
    let objPhoto = {
      name: req.file.cloudStorageObject,
      link: req.file.cloudStoragePublicUrl,
      userId: req.decoded.userId,
      caption: req.body.caption
    }
    let dataPhoto = new PhotoModel(objPhoto)
    dataPhoto.save()
      .then(result => {
        res.status(HttpStatus.OK).json({
          messages: "Photos Created",
          data: result
        })
      })
      .catch(err => {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
          messages: "Data Photos Error Server",
          data: err,
          error: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR)
        })
      })
  }

  static update(req, res) {
    let { caption } = req.body
    PhotoModel.findOneAndUpdate({
      _id: req.params.id,
      userId: req.decoded.userId
    }, { caption }, {
        new: true
      })
      .then(result => {
        return result
          .populate('comments._id')
          .populate('likes')
          .populate('userId')
          .execPopulate()
      })
      .then(result => {
        res.status(HttpStatus.OK).json({
          messages: "Photo Updated",
          data: result
        })
      })
      .catch(err => {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
          messages: "Update Photo Error Server",
          data: err,
          error: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR)
        })
      })
  }

  static comment(req, res) {
    let objComment = {}
    objComment._id = req.decoded.userId
    objComment.comment = req.body.comment
    PhotoModel.findByIdAndUpdate(req.params.id, {
      $push: {
        comments: objComment
      }
    }, { new: true })
      .then(result => {
        return result
          .populate('comments._id')
          .populate('likes')
          .populate('userId')
          .execPopulate()
      })
      .then(result => {
        res.status(HttpStatus.OK).json({
          messages: "Comment Insert",
          data: result
        })
      })
  }

  static like(req, res) {
    PhotoModel.findById(req.params.id)
      .then(photo => {
        let query = {}
        let indexLikes = photo.likes.find(like => like == req.decoded.userId)
        if (indexLikes == undefined) {
          query.$push = {
            likes: req.decoded.userId
          }
        } else {
          query.$pull = {
            likes: req.decoded.userId
          }
        }
        console.log(query, indexLikes)
        PhotoModel.findByIdAndUpdate(req.params.id, query, { new: true })
          .then(result => {
            return result
              .populate('comments._id')
              .populate('likes')
              .populate('userId')
              .execPopulate()
          })
          .then(result => {
            console.log(result)
            res.status(HttpStatus.OK).json({
              messages: "Like Insert",
              data: result
            })
          })
      })


  }

  static destroy(req, res) {
    PhotoModel.findByIdAndRemove(req.params.id)
      .then(result => {
        res.status(HttpStatus.OK).json({
          messages: "Photo Deleted",
          data: result
        })
      })
  }
}

module.exports = PhotoController
