const {ObjectId} = require('mongodb');
const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');

const jwt = require('jsonwebtoken');

const userOneId = new ObjectId();
const userTwoId = new ObjectId();

const todos = [{
    _id: new ObjectId(),
    text: 'Todo note for GET request 1',
    completed: false,
    completedAt: null,
    _creator: userOneId
}, {
    _id: new ObjectId(),
    text: 'Todo note for GET request 2',
    completed: true,
    completedAt: 333,
    _creator: userTwoId
}];


const users = [{
    _id: userOneId,
    email: 'vasanth@gmail.com',
    password: 'vasanth123',
    tokens: [{
        access: 'auth', 
        token: jwt.sign({ _id: userOneId, access: 'auth' }, process.env.JWT_SECRET)
    }]
},
    {
        _id: userTwoId,
        email: 'srilatha@gmail.com',
        password: 'srilatha123',
        tokens: [{
            access: 'auth',
            token: jwt.sign({ _id: userTwoId, access: 'auth' }, process.env.JWT_SECRET)
        }]
    }
];

const populateTodos = (done) => {
    Todo.remove({}).then(() =>{
        return Todo.insertMany(todos); 
    }).then(() => done());
};

const populateUsers = (done) => {
    User.remove({}).then(() =>{
        let userOne = new User(users[0]).save();
        let userTwo = new User(users[1]).save(); 
        
        return Promise.all([userOne, userTwo]);

    }).then(() => done());
};
module.exports = {todos, populateTodos, users, populateUsers}; 