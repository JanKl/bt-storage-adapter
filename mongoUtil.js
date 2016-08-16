/* 
 * Concept and code taken from http://stackoverflow.com/a/24634454
 */
var MongoClient = require('mongodb').MongoClient;

var _db;

module.exports = {
  connectToServer: function (connectionString, callback) {
    MongoClient.connect(connectionString, function (err, db) {
      _db = db;
      return callback(err);
    });
  },
  getDb: function () {
    return _db;
  }
};