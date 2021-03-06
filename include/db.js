let MongoClient = require("mongodb").MongoClient;
let dbo = null;

MongoClient.connect(process.env.MONGODB_URL, function (err, db) {
  if (err) throw err;
  dbo = db.db(process.env.DB_NAME, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

module.exports = {
  dbFind: async function (collection, query) {
    return new Promise(function (resolve, reject) {
      dbo.collection(collection).findOne(query, function (err, items) {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          console.log("dbFind - items found. query: ", query);
          resolve(items);
        }
      });
    });
  },

  dbDelete: function (collection, query) {
    return new Promise(function (resolve, reject) {
      dbo.collection(collection).deleteOne(query, function (err, obj) {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          console.log("dbDelete - 1 document deleted! query: ", query);
          resolve();
        }
      });
    });
  },

  dbDeleteMany: function (collection, query) {
    return new Promise(function (resolve, reject) {
      dbo.collection(collection).deleteMany(query, function (err, obj) {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          console.log("dbDeleteMany - deleted! query: ", query);
          resolve();
        }
      });
    });
  },

  dbInsert: function (collection, content) {
    return new Promise(function (resolve, reject) {
      dbo.collection(collection).insert(content, function (err, items) {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          console.log("dbInsert - 1 document inserted!");
          resolve();
        }
      });
    });
  },

  dbUpdate: async function (collection, query, update) {
    if (update.$set) delete update.$set._id;

    return new Promise(function (resolve, reject) {
      dbo.collection(collection).updateOne(query, update, { upsert: true }, function (err, obj) {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          console.log(update);
          console.log("dbUpdate - 1 document updated! query: ", query);
          resolve();
        }
      });
    });
  },
};
