const express = require('express');
const router = express.Router();
const PhotoModel = require('../models/photo')
const HttpStatus = require('http-status-codes')
const ObjectID = require('mongodb').ObjectID;

class PhotoController {
  static get(req, res) {
    PhotoModel.find()
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
      name : req.file.cloudStorageObject,
      link : req.file.cloudStoragePublicUrl,
      userId : req.decoded.userId,
      caption : req.body.caption
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
    let options = {
      ...authorization(req)
    }
    options.new = true
    let { name, email, password, role } = req.body
    PhotoModel.findByIdAndUpdate(req.params.id, { name, email, password, role }, options)
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

  static destroy(req, res) {
    let options = {
      ...authorization(req)
    }
    options.new = true
    PhotoModel.findByIdAndRemove(req.params.id, options)
      .then(result => {
        res.status(HttpStatus.OK).json({
          messages: "Photo Deleted",
          data: result
        })
      })
  }
}

module.exports = PhotoController