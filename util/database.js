const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = callback => {
  MongoClient.connect(
    'mongodb+srv://ankit9835:6202017915Aa@cluster0.2dpiw.mongodb.net/node_mongodb?retryWrites=true&w=majority'
  )
    .then(client => {
      console.log('Connected!');
      _db = client.db();
     callback();
    })
    .catch(err => {
      console.log(err);
    });
};

const getDb = () => {
    if(_db){
        return _db;
    }
    throw 'No Database Found';
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
