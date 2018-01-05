const express = require('express');
const router = express.Router();
const UserModel = require('../models/user')
const HttpStatus = require('http-status-codes')
const ObjectID = require('mongodb').ObjectID;

class UserController {
  static get(req, res) {
    UserModel.find()
      .then(result => {
        res.status(HttpStatus.OK).json({
          messages: "Data Users",
          data: result
        })
      })
      .catch(err => {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
          messages: "Data Users Error Server",
          data: err,
          error: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR)
        })
      })
  }

  static getSingle(req, res) {
    UserModel.findById(req.params.id)
    .populate('follows')
    .exec()
      .then(result => {
        res.status(HttpStatus.OK).json({
          messages: "Data Single User",
          data: result
        })
      })
      .catch(err => {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
          messages: "Data User Error",
          data: err,
          error: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR)
        })
      })
  }

  static create(req, res) {
    let objUser = {
      name : req.body.name,
      username : req.body.username,
      email : req.body.email,
      password : req.body.password,
    }
    let dataUser = new UserModel(objUser)
    dataUser.save()
      .then(result => {
        res.status(HttpStatus.OK).json({
          messages: "Users Created",
          data: result
        })
      })
      .catch(err => {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
          messages: "Data Users Error Server",
          data: err,
          error: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR)
        })
      })
  }

  static update(req, res) {
    let { name, email, password, follows } = req.body
    UserModel.findByIdAndUpdate(req.params.id, { name, email, password, follows }, {new : true})
      .then(result => {
        res.status(HttpStatus.OK).json({
          messages: "User Updated",
          data: result
        })
      })
      .catch(err => {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
          messages: "Update User Error Server",
          data: err,
          error: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR)
        })
      })
  }

  static follow(req, res) {
    let follow = req.body.follow
    UserModel.findById(req.params.id)
    .then(user => {
      let query = {}
      let indexFollow = user.follows.find(followedUser => followedUser == follow)
      if(indexFollow == undefined){
        query.$push = {
          follows: follow
        }
      }else{
        query.$pull = {
          follows : follow
        }
      }
      UserModel.findByIdAndUpdate(req.params.id, query, { new : true})
      .then(result => {
        return result
        .populate('follows')
        .execPopulate()
      })
      .then(result =>{
        res.status(HttpStatus.OK).json({
          messages: 'Followed',
          data: result
        })
      })
    })
  }

  static destroy(req, res) {
    let options = {
      ...authorization(req)
    }
    options.new = true
    UserModel.findByIdAndRemove(req.params.id, options)
      .then(result => {
        res.status(HttpStatus.OK).json({
          messages: "User Deleted",
          data: result
        })
      })
  }

}

module.exports = UserController