var app = require('./server-config.js');
var mongoose = require('mongoose');
var dbUri = process.env.MONGOLAB_URI || 'mongodb://127.0.0.1';

mongoose.connect(dbUri);

var port = process.env.PORT || 4568;

app.listen(port);

console.log('Server now listening on port ' + port);
