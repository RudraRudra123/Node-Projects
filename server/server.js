var express = require('express'); 
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/Todo');
var {User} = require('./models/User');

var app = express();
app.use(bodyParser.json());
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
app.listen(3000, () => {
   // console.log('Todo App is running on port 3000');
    
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