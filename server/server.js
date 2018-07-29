require('./config/config');

var express = require('express'); 
var bodyParser = require('body-parser');
var {ObjectId} = require('mongodb');
var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();
const port = process.env.PORT ; 

app.use(bodyParser.json());
//--------------------------------------------------
app.post('/todos', (req, res) => {
    console.log(req.body); 
    var todo = new Todo({
        text: req.body.text
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (err) => {
        res.status(400).send(err);
    });

});
//--------------------------------------------------
//GET /todo (getall)
app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({todos});
    }, (e) => {
        res.status(400).send(e);
    })
});

//GET /todo/123456
app.get('/todos/:id', (req, res) => {

    let id = req.params.id; 
  
    if (!ObjectId.isValid(id)) {   //Object id is mongo db method
        return res.status(404).send();
    }
    console.log('You have hit route /todos/id');
    Todo.findById(id).then((todo) =>{
        if(!todo) {
            return res.status(404).send(); 
        }
        return res.send({todo}); 
    }).catch((e) => {
        return res.status(400).send();
    });
})
//--------------------------------------------------
app.listen(port, () => {
   console.log(`Todo App is running on port ${port}`);
    
});

module.exports = {app} ;
    

//------------------Old code ----------------------

/* var mongoose = require('mongoose') ;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp'); */

/* var Todo = mongoose.model('Todo', {
    text: {
        type : String,
        required : true,
        minlength: 1,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false

    },
    completedAt: {
        type: Number,
        default: null
    }
});

var newTodo = new Todo({
    text: 'New todo Collection'
});

newTodo.save().then((doc) => {
    console.log('Saved todo', doc);
}, (e) => {
    console.log('Unable to save todo',e);
});

var otherTodo = new Todo({
    text: true
});

otherTodo.save().then((doc) => {
    console.log(JSON.stringify(doc, undefined, 2));
}, (err) =>{
    console.log('Unable to save ',err);
});

//User
//email - require it - trim it - set type - set min length of 1

var User = mongoose.model('User', {
    user: {
        type: String,
        minlength :1,
        required: true 
    },
    email:{
        type: String,
        trim: true,
        minlength :1,
        required: true
    }
});

var user = new User({user: 'Rakesh Rudra', email: 'rudra.rakesh@gmail.com'});
user.save().then( (doc) => {
    console.log('User saaved',doc);
}, (e) => {
    console.log('Unable to save user',e);
});  */