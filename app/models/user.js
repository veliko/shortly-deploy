// var db = require('../config');
// var bcrypt = require('bcrypt-nodejs');
// var Promise = require('bluebird');

// var User = db.Model.extend({
//   tableName: 'users',
//   hasTimestamps: true,
//   initialize: function() {
//     this.on('creating', this.hashPassword);
//   },
//   comparePassword: function(attemptedPassword, callback) {
//     bcrypt.compare(attemptedPassword, this.get('password'), function(err, isMatch) {
//       callback(isMatch);
//     });
//   },
//   hashPassword: function() {
//     var cipher = Promise.promisify(bcrypt.hash);
//     return cipher(this.get('password'), null, null).bind(this)
//       .then(function(hash) {
//         this.set('password', hash);
//       });
//   }
// });




// MONGO USERS TABLE
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');
var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  username: { type : String , unique : true, required : true, dropDups: true },
  password: { type : String , unique : false, required : true }
});


UserSchema.methods.comparePassword = function(attemptedPassword, savedPassword, callback) {
    bcrypt.compare(attemptedPassword, savedPassword, function(err, isMatch) {
      callback(null, isMatch);
    });
};

UserSchema.pre('save', function(next) {
  var cipher = Promise.promisify(bcrypt.hash);
  return cipher(this.password, null, null).bind(this)
    .then(function(hash) {
      this.password = hash;
      next();
  });
});

var User = mongoose.model('User', UserSchema);

module.exports = User;