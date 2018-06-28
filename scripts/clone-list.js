"use strict";

const Twitter = require('twitter');
const config = require('../config').twitter_key;
const T = new Twitter(config);

function cloneList(list_name, screen_name) {
    let options = {
        slug: list_name,
        owner_screen_name: screen_name,
        count: 5000
    };
    T.get('lists/members', options, (err, res, result) => {
        if (err) throw new Error(err);
        let users = res.users;
        let user_ids = [];
        users.forEach(user => {
            user_ids.push(user.id_str);
        });
        T.post('lists/create', {
            name: list_name,
            mode: 'public'
        }, (err, res) => {
            if (err) throw new Error(err);
            console.log(`List created with ID ${res.id_str}. \nProceeding with adding members.`);
            T.post('lists/members/create_all', {
                list_id: res.id_str,
                user_id: user_ids.join(',')
            }, (err, res) => {
                if (err) throw new Error(err);
                console.log(`${user_ids.length} members added to your list. \nDone.`);
            });
        });
    });
}

if (require.main === module) {
    cloneList(process.argv[2], process.argv[3]);
} else {
    module.exports = cloneList
}