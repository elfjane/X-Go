var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

// Connection URL
var url = 'mongodb://localhost:27017/test';

// Use connect method to connect to the server
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected successfully to server");


/*
  insertDocuments(db, function() {
    findDocuments3(db, function() {
      db.close();
    });
  });
  */
    findDocuments3(db, function(docs) {
		console.log(docs.length);
		findDocuments3(db, function(docs) {
		  db.close();
		});
    });

  /*
	updateDocument(db, function() {
		findDocuments(db, function() {
		  db.close();
		});
	});
	/
//  db.close();
*/
});

var insertDocuments = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('documents');
  // Insert some documents
  collection.insertMany([
    {a : 1}, {a : 2}, {a : 3}
  ], function(err, result) {
    assert.equal(err, null);
    assert.equal(3, result.result.n);
    assert.equal(3, result.ops.length);
    console.log("Inserted 3 documents into the collection");
    callback(result);
  });
}

var findDocuments = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('documents');
  // Find some documents
  collection.find({}).toArray(function(err, docs) {
    assert.equal(err, null);
    console.log("Found the following records");
    callback(docs);
  });
}

var findDocuments3 = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('documents');
  // Find some documents
  collection.find({'a': 33}).toArray(function(err, docs) {
    assert.equal(err, null);
    console.log("Found the following records");
    callback(docs);
  });      
}

var updateDocument = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('documents');
  // Update document where a is 2, set b equal to 1
  collection.updateMany({ a : 2 }
    , { $set: { b : 5 } }, function(err, result) {
    assert.equal(err, null);
//    assert.equal(1, result.result.n);
    console.log("Updated the document with the field a equal to 2");
    callback(result);
  });  
}

var findoneDocument = function(db, fort_id, callback) {
	var collection = db.collection('documents');
	collection.findOne({"FortId":fort_id}, function(err, doc) {
	    assert.equal(err, null);
		db.close();
	});
}

var request = require("request")

var url = "http://pokemon.elfjane.com/getforts"
request({
    url: url,
    json: true
}, function (error, response, body) {

    if (!error && response.statusCode === 200) {
		console.log(body);
		for (var k in body){
			//console.log(k) ;
			console.log(body[k]) ;
		}
    }
})
console.log(new int64('123456'));