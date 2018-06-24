const Twitter = require('twitter');
const config = require('./config');
const T = new Twitter(config);
const Promise = require('promise');
const MongoClient = require('mongodb').MongoClient;

//-------------------------------------------------------------------
// Get users by interest or slug
let url = 'users/search';
let options = {
    q: 'Equity advisor', //NSE India
    page: 1,
    count: 20,
    include_entities: false
}
let isDuplicate = false;
let records = [];

function fn(url, options) {
    T.get(url, options, (err, response) => {
        if (err) {
            console.log(err);
        } else {
            records = checkDuplicate(records, response);
            console.log(`${records.length} records received till now...`)
            if (!isDuplicate) {
                options.page++;
                fn(url, options);
            } else {
                insertIntoDb(records);
            }
        }
    });
}

function checkDuplicate(oldResult, newResult) {
    for (let i = 0; i < newResult.length; i++) {
        let tempArray = oldResult.filter((singleResult) => {
            return singleResult.id_str === newResult[i].id_str;
        });
        if (!tempArray.length) {
            oldResult.push(newResult[i]);
        } else {
            isDuplicate = true;
        }
    }
    return oldResult;
}

function createRecords(res) {
    let tempArray = [];
    for (i = 0; i < res.length; i++) {
        let latest_tweet = res[i].status ? res[i].status.text : 'private account';
        let tempObj = {
            id_str: res[i].id_str,
            name: res[i].name,
            screen_name: res[i].screen_name,
            location: res[i].location,
            description: res[i].description,
            url: res[i].url,
            followers_count: res[i].followers_count,
            friends_count: res[i].friends_count,
            listed_count: res[i].listed_count,
            verified: res[i].verified,
            statuses_count: res[i].statuses_count,
            latest_tweet: latest_tweet,
            following: res[i].following
        }
        tempArray.push(tempObj);
    }
    return tempArray;
}

function insertIntoDb(res) {
    let records = createRecords(res);
    MongoClient.connect('mongodb://localhost:27017', (err, db) => {
        if (err) throw err;
        let dbo = db.db('Twitter');
        dbo.createCollection(options.q, (err, res) => {
            if (err) throw err;
            dbo.collection(options.q).insertMany(records, (err, res) => {
                if (err) throw err;
                console.log(`${res.insertedCount} records inserted`);
                db.close();
            });
        });
    });

}

fn(url, options);

//-------------------------------------------------------------------