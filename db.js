var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
let dbo = null;

MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    dbo = db.db("mydb");
});


function insertOne(collection, content){

    dbo.collection(collection).insertOne(content, function(err, res) {
        if (err) throw err;
        console.log("1 document inserted!");
        db.close();
    });

}


function find(collection, query){
    return new Promise(function(resolve, reject) {
        collection.find(query).toArray(function(err, items) {
            if (err) {
              reject(err);
            } else {
              console.log(items);
              resolve(items);
            }   
        }); 
    });
}