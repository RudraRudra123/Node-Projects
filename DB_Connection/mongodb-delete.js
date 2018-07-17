//Connect to MongoDB
const {MongoClient, ObjectID} =  require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if (err)
    {
        return console.log('Unble to connect to MongoDB');
    }
    const db = client.db('TodoApp')
    //delete many
    db.collection('Users').deleteMany({name: 'Rakesh'}).then((result) => {
        console.log(result);
    });

    //delete one
    db.collection('Users').deleteOne({name: 'Srilatha'}).then((result) => {
        console.log(result);
    });
    db.collection('Users').findOneAndDelete({ name: 'Suhas Rudra' }).then((result) => {
        console.log(result);
     });
    client.close();

    //delete one
    //find one and delete
});








