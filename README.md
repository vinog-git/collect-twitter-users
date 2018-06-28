# Collect Twitter users

3 individual modules (as on 28th June, 2018)

* **cloneList** : Clone Twitter list to your account
* **createCollection** : Create a collection of users in Mongo based on query searching
* **insertIntoMongo** : Directly insert data into MongoDB with collection_name and data to be inserted

> These modules can be required and used individually e.g., `node scripts/clone-list.js list_name, list_owner_screen_name`
> Or achieve the same through a simple CLI input with `npm start`