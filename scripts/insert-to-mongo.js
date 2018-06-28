const MongoClient = require('mongodb').MongoClient;

function insertIntoMongo(collection_name, records) {
    
    let url = require('../config').mongo_key;
    MongoClient.connect(url, (err, db) => {
        if (err) throw err;
        let dbo = db.db('twitter');
        dbo.createCollection(collection_name, (err, res) => {
            if (err) throw err;
            dbo.collection(collection_name).insertMany(records, (err, res) => {
                if (err) throw new Error(err);
                console.log(`${res.insertedCount} records inserted.\nDone.`);
                db.close();
            });
        });
    });
}
if (require.main === module) {
    insertIntoMongo(process.argv[3], process.argv[4]);
} else {
    module.exports = insertIntoMongo;
}