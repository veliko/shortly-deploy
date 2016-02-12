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