//Connect to Mongo db using mongoClient 

const MongoClient = require('mongodb').MongoClient; 

//create a new database called TodoApp
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client)=>{
    if (err) {
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to DB');
    const db = client.db('TodoApp')

    db.collection('Todos').insertOne({
        text: 'first record inserted',
        completed: false
    }, (err, result)=>{
        if (err){
            return console.log('Unable to insert todo record', err);
        }
        console.log(JSON.stringify(result.ops, undefined, 2));   
    });
    
    db.collection('Users').insertOne({
        name: 'Rakesh',
        age: 33,
        location: 'Philadelphia'
    }, (error, result) => {
        if (err) {
            return console.log('Unable to insert user');
        }
        console.log(result.ops);
    })
    client.close();
});
