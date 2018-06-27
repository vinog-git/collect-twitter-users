const MongoClient = require('mongodb').MongoClient;

function insertIntoMongo(db_name, collection_name, records) {
    let url = process.env.mongo_key || "mongodb://localhost:27017";
    MongoClient.connect(url, (err, db) => {
        if (err) throw err;
        let dbo = db.db(db_name);
        dbo.createCollection(collection_name, (err, res) => {
            if (err) throw err;
            dbo.collection(collection_name).insertMany(records, (err, res) => {
                if (err) throw err;
                console.log(`${res.insertedCount} records inserted.\nDone.`);
                db.close();
            });
        });
    });
}
if (require.main === module) {
    insertIntoMongo(process.argv[2], process.argv[3], process.argv[4]);
} else {
    module.exports = insertIntoMongo;
}