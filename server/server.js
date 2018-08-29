require('./config/config');

const express = require('express'); 
const bodyParser = require('body-parser');
const {ObjectId} = require('mongodb');
const {mongoose} = require('./db/mongoose');
const _ = require('lodash');

const {Todo} = require('./models/todo');
const {User} = require('./models/user');
const {authenticate} = require('./middleware/authenticate');

let app = express();
const port = process.env.PORT ; 

app.use(bodyParser.json());
//--------------------------------------------------
//POST todos
app.post('/todos', authenticate, (req, res) => {

    const todo = new Todo({
        text: req.body.text,
        _creator: req.user._id
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (err) => {
        res.status(400).send(err);
    });

});
//--------------------------------------------------
//GET /todo (get-all)
app.get('/todos',authenticate, (req, res) => {
    Todo.find({
        _creator: req.user._id
    }).then((todos) => {
        res.send({todos});
    }, (e) => {
        res.status(400).send(e);
    })
});
//--------------------------------------------------
//GET /todos/123456
app.get('/todos/:id', authenticate, (req, res) => {

    let id = req.params.id; 
//Object id is mongo db method
    if (!ObjectId.isValid(id)) {  
        return res.status(404).send();
    }
    console.log('You have hit route /todos/id');
    Todo.findOne({
        _id:id,
        _creator: req.user._id
    }).then((todo) =>{
        if(!todo) {
            return res.status(404).send(); 
        }
        return res.send({todo}); 
    }).catch((e) => {
        return res.status(400).send();
    });
});
//--------------------------------------------------
//DELETE /todos/id
app.delete('/todos/:id', authenticate, (req,res) => {
    let id = req.params.id;

    //validate the id, if not valid return 404
    if (!ObjectId.isValid(id)) {
        console.log('Object id not valid for delete');
        return res.status(404).send(); 
    }
    Todo.findOneAndRemove({
        _id: id,
        _creator: req.user._id
    }).then((todo) => {
        if(!todo) {
            return res.status(404).send() ;
        }
        res.send({todo}) ;
    }).catch((e) =>{
        res.status(400).send();
    });
});
//--------------------------------------------------
//PATCH /todos/id
app.patch('/todos/:id', authenticate, (req, res) => {
    let id = req.params.id ;
    //lodash- picks text and completed properties from the body
    let body = _.pick(req.body, ['text', 'completed']); 
    if(!ObjectId.isValid(id)) {
        return res.status(404).send(); 
    }
    console.log(body);
    if(_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    };

    Todo.findOneAndUpdate({_id: id, _creator: req.user._id}, { $set: body }, { new: true }) //return updated document
    .then((todo) =>{
        if(!todo) {
            return res.status(404).send();
        }
        res.send({todo});
     })
    .catch((e) => {
        res.status(400).send();
    })
});
//--------------------------------------------------
app.listen(port, () => {
   console.log(`Todo App is running on port ${port}`);
    
});

//==============================================================
//POST /users
app.post('/users', (req, res) => {
    let body = _.pick(req.body, ['email', 'password']);
    let user = new User(body); //body is an object that can directly get into database

    user.save().then(() => {
        return user.generateAuthToken();
        //res.send(user);
    }).then((token) => {
        res.header('x-auth', token).send(user);
    }).catch((e) => {
        res.status(400).send(); 
    });  
});

//Private route to authenticate user by token
app.get('/users/me', authenticate, (req, res) =>{
    res.send(req.user);
});


//Validate a user login, send token after authenticated
//POST /users/login {email, password}

app.post('/users/login', (req, res) => {

    const body = _.pick(req.body,['email', 'password']);
    User.findByCredentials(body.email, body.password).then((user) => {
       
       return user.generateAuthToken().then((token) => {
           res.header('x-auth', token).send(user) ;
       }) 
    }).catch((e) => {
        res.status(400).send();
    });
});

//Sign out
app.delete('/users/me/token', authenticate, (req, res) => {
 
    req.user.removeToken(req.token).then(() => {
        res.status(200).send();
    }, () => {
        res.status(400).send();
    });
});

module.exports = { app };