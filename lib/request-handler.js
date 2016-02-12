var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');
var mongoose = require('mongoose');

var db = require('../app/config');
var User = require('../app/models/user');
var Link = require('../app/models/link');

exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function() {
    res.redirect('/login');
  });
};

exports.fetchLinks = function(req, res) {
  Link.find(function(err, data){
    if (err) { console.log(err); }
    else { 
      console.log(data);
      res.send(200, data); }
  });
};

exports.saveLink = function(req, res) {
  var uri = req.body.url;
  var newLink;
  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.send(404);
  } else {
    util.getUrlTitle(uri, function(err, title) {
      if (err) {
        console.log('Error reading URL heading: ', err);
        return res.send(404);
      } else {
        new Link({
          url: uri,
          title: title,
          baseUrl: req.headers.origin,
          visits: 0
        }).save(function(err){
          if (err) { console.log(err); }
           else {
            console.log("saved!!!");
            res.send(200, this.emitted.complete[0]);
          }
        });
      }
    });
  }
};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.find({username: username}, function(err, data){
    if (err){
    } else {
      var user = data[0];
      if (!user) {
        console.log("Account does not exist");
        res.redirect('/login');
      } else if(user.username === username) {
        var savedPassword = user.password;
        user.comparePassword(password, savedPassword, function(err, isMatch){
          if(err) {
            console.log(err);
          } else {
            console.log("isMatch: ", isMatch);
            if(isMatch) {
              util.createSession(req, res, user);  
            } else {
              res.redirect('/login');
            }
          }
        });
      }
    }
  });
};

exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  new User({ username: username, password: password })
    .save(function(err){
      if (err) { console.log(err); }
      else {
        console.log("saved!!!");
        util.createSession(req, res, this)
      }
    });
};

exports.navToLink = function(req, res) {
  Link.findOne({code: req.params[0] }, function(err, link) {
    if (!link) {
      res.redirect('/');
    } else {
      link.visits += 1;
      link.save(function() {
        return res.redirect(link.url);
    });
  }
});
};