var mongoose = require('mongoose');
var crypto = require('crypto');

var LinkSchema = new mongoose.Schema({
  url: { type : String , unique : true, required : true, dropDups: true },
  baseUrl: { type : String , unique : false },
  code: { type : String , unique : false },
  title: { type : String , unique : false },
  visits: { type : Number , unique : false },
});


LinkSchema.pre('save', function(next) {
  var shasum = crypto.createHash('sha1');
    shasum.update(this.url);
    this.code = shasum.digest('hex').slice(0, 5);
    next();
});

var Link = mongoose.model('Link', LinkSchema);

module.exports = Link;