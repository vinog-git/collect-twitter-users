module.exports = {
    q: ['Choose an option: \n--------------------\n\n1: createCollection \n2: cloneList \n3: insertIntoMongo'],
    sub: {
        '1': {
            q: ['Enter the Query string to create collection with.']
        },
        '2': {
            q: ['Enter the list Name', 'Enter the screen Name of the user']
        }
    }
}