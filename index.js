"use strict";

const createCollection = require('./scripts/create-collection');
const cloneList = require('./scripts/clone-list');
const insertIntoMongo = require('./scripts/insert-to-mongo');

if (process.argv.length < 3) {
    console.log(`More arguments required. e.g., npm start cloneList list_name, list_owner_screen_name`);
} else {
    switch (process.argv[2]) {
        case 'createCollection':
            // Pass the query String to create collection with
            createCollection(process.argv[3]);
            break;
        case 'cloneList':
            // Pass the list_name, screen_name to clone a list
            cloneList(process.argv[3], process.argv[4]);
            break;
        case 'insertIntoMongo':
            insertIntoMongo(process.argv[2], process.argv[3], process.argv[4]);
            break;
        default:
            console.log('No valid action specified.');
            break;
    }
}