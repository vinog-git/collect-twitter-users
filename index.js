"use strict";

const getUserOptions = require('./scripts/cli-options');
const createCollection = require('./scripts/create-collection');
const cloneList = require('./scripts/clone-list');
const insertIntoMongo = require('./scripts/insert-to-mongo');

getUserOptions((receivedValues) => {
    let chosenAction = receivedValues.shift();
    if (chosenAction) {
        switch (chosenAction) {
            case '1':
                // Pass the query String to create collection with
                createCollection.apply(null, receivedValues);
                break;
            case '2':
                // Pass the list_name, screen_name to clone a list
                cloneList.apply(null, receivedValues);
                break;
            case '3':
                // Pass the db_name, collection_name, records to insert records
                insertIntoMongo.apply(null, receivedValues);
                break;
            default:
                console.log('No valid action specified.');
                break;
        }
    }else{
        console.log('Invalid Option');
    }
});