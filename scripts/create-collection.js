"use strict";

const Twitter = require('twitter');
const config = require('../config');
const T = new Twitter(config);
const insertIntoMongo = require('./insert-to-mongo');

let isDuplicate = false;
let options = {
    q: '',
    page: 1,
    include_entities: false
}

function createCollection(query) {
    options.q = query;
    let records = [];
    T.get('users/search', options, (err, response) => {
        if (err) {
            console.log(err);
        } else {
            records = checkDuplicate(records, response);
            if (!isDuplicate && options.page < 50) {
                console.log(`${records.length} records received till now...`);
                options.page++;
                createCollection(query);
            } else {
                console.log(`Inserting ${records.length} records...`);
                insertIntoMongo('twitter', query, cleanUpRecords(records));
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

function cleanUpRecords(records) {
    let cleanedUpRecords = [];
    for (i = 0; i < records.length; i++) {
        cleanedUpRecords.push(filterNecessaryFields(records[i]));
    }
    return cleanedUpRecords;
}

function filterNecessaryFields(record) {
    let necessaryFields = [id_str, name, screen_name, location, description, url, followers_count, friends_count, listed_count, verified, statuses_count, latest_tweet, following];
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