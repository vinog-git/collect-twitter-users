"use strict";

const Twitter = require('twitter');
const config = require('../config').twitter_key;
const T = new Twitter(config);
const insertIntoMongo = require('./insert-to-mongo');

let isDuplicate = false;
let isEmpty = false;
let records = [];

let options = {
    q: '',
    page: 1,
    include_entities: false
}

function createCollection(query) {
    options.q = query;
    T.get('users/search', options, (err, response) => {
        if (err) throw new Error(err);
        records = checkDuplicate(records, response);
        if (!isDuplicate && !isEmpty && options.page < 50) {
            console.log(`${records.length} records received till now...`);
            options.page++;
            createCollection(query);
        } else if (!isEmpty) {
            console.log(`Inserting ${records.length} records...`);
            insertIntoMongo(query, cleanUpRecords(records));
        } else {
            console.log(`No records found`);
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
    if (!oldResult.length) {
        isEmpty = true;
    }
    return oldResult;
}

function cleanUpRecords(records) {
    let cleanedUpRecords = [];
    for (let j = 0; j < records.length; j++) {
        cleanedUpRecords.push(filterNecessaryFields(records[j]));
    }
    return cleanedUpRecords;
}

function filterNecessaryFields(record) {
    let necessaryFields = ['id_str', 'name', 'screen_name', 'location', 'description', 'url', 'followers_count', 'friends_count', 'listed_count', 'verified', 'statuses_count', 'latest_tweet', 'following'];
    record.latest_tweet = record.status ? record.status.text : 'Private Account';
    for (let field in necessaryFields) {
        let fieldId = necessaryFields[field];
        if (!record.hasOwnProperty(fieldId)) {
            delete record[fieldId];
        }
    }
    return record;
}

if (require.main === module) {
    createCollection(process.argv[3]);
} else {
    module.exports = createCollection;
}