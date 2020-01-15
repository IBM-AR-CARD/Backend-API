var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
let dbo = null;

MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    dbo = db.db("mydb");
});




module.exports = {

    dbFind: async function (collection, query){
        return new Promise(function(resolve, reject) {
            dbo.collection(collection).find(query).toArray(function(err, items) {
                if (err) {
                    console.error(err);
                    reject(err);
                } else {
                    console.log("dbFind - items found. query:", query);
                    resolve(items);
                }   
            }); 
        });
    },

    dbDelete : function (collection, query){
        return new Promise(function(resolve, reject) {
            dbo.collection(collection).deleteOne(query, function(err, obj) {
                if (err) {
                    console.error(err);
                    reject(err);
                  } else {
                    console.log("dbDelete - 1 document deleted!");
                    resolve();
                  }   
              });
        });
    },


    dbInsert : function (collection, content){

        return new Promise(function(resolve, reject) {
            dbo.collection(collection).insertOne(content, function(err, items) {
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


    dbUpdate: async function(collection, query, newValue){

        return new Promise(function(resolve, reject) {
            dbo.collection(collection).updateOne(query, newValue, function(err, obj) {
                if (err) {
                    console.error(err);
                    reject(err);
                  } else {
                    console.log("dbUpdate - 1 document updated! id: " + newValue._id);
                    resolve();
                  }   
              });
        });
    }
    
}