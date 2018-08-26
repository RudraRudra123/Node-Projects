const expect = require('expect');
const request = require('supertest') ;
const {ObjectId} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const { User } = require('./../models/user')
var bodyParser = require('body-parser');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');
//for GET operation create a collection todos 
/* const todos = [{
    _id: new ObjectId(),
    text: 'Todo note for GET request 1',
    completed: false,
    completedAt: null
},{
    _id: new ObjectId(),
    text: 'Todo note for GET request 2',
    completed: true,
    completedAt: 333
}]; */
beforeEach(populateUsers);
beforeEach(populateTodos);

//Before each POST 


describe('POST /todos', () => {
    it('should create new todo--', (done) => {
        let text = 'Test todo text';

        request(app)    
        .post('/todos')
        .send({text})
        .expect(200)
        .expect((res) => {
           // console.log('you have hit res obj verification code'); 
            expect(res.body.text).toBe(text);
        })
        .end((err, res) => {
            if (err) {
                return done(err);
            }
            Todo.find().then((todos) => {
                expect(todos.length).toBe(3);
                console.log('One object exists');
                done();
            }).catch((e) => done(e));
        });
    });

    it('should not create todo with invalid body data', (done) => {
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, res) => {
                if (err) {
                    console.log('err response obj:', err);
                    return done(err); }
                Todo.find().then((todos) => {
                    console.log('legth of todo',todos.length);
                    expect(todos.length).toBe(2);
                    done();
                    
                }).catch((e) => {
                    console.log('Errored out');
                    done(e);});
            });

    });
});

describe('GET /todos/', () => {
    it('Should get all todos', (done) => {
        request(app)
        .get('/todos')        
        .expect(200)
        .expect((res) => {
            expect(res.body.todos.length).toBe(2);
        })
        .end(done);
    })
}); 

describe('GET /todos/:id', () => {
    it('Should get todo by id', (done) => {
        console.log(todos[0]._id.toHexString());
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    });

    it('Should return 404 if todo not found', (done) => {
        let hexId = new ObjectId().toHexString(); 
        request(app)
            .get(`/todos/${hexId}`)
            .expect(404)
            .end(done);
    });
it('Should return 404 for non-object ids', (done) => {
        let hexId = new ObjectId().toHexString(); 
        request(app)
            .get(`/todos/${hexId}`)
            .expect(404)
            .end(done);
    });
it('Should return 404 if todo not found', (done) => {
        let hexId = '123abcd'; 
        request(app)
            .get(`/todos/${hexId.toString('hex')}`)
            .expect(404)
            .end(done);
    });
});

describe('DELETE /todo/:id', () => {
        it('Should remove a todo', (done) => {
            let hexId = todos[0]._id.toHexString(); 
            //console.log(todos[0]._id);
            //console.log(`/todo/${todos[0]._id.toHexString()}`);
            request(app)
                .delete(`/todos/${hexId}`)
                .expect(200)
                .expect((res) => {
                    expect(res.body.todo._id).toBe(hexId);
                })
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    };
                    //query database using findById and it should fail as it is deleted 
                    Todo.findById(hexId).then((todo) => {
                        expect(todo).toBeFalsy(); 
                        done();
                }).catch((e) => done(e));          
            });
    });
    it('Should return 404 if todo not found', (done) => {
        let hexId = new ObjectId().toHexString();
        request(app)
        .delete(`/todos/${hexId}`)
        .expect(404)
        .end(done);
    });
    it('Should return 404 if object id is invalid', (done) => {
        let hexId = 'abc890';
        request(app)
        .delete(`/todos/${hexId.toString('hex')}`)
        .expect(404)
        .end(done);
    });
});

describe('PATCH /todos/:id', (done) => {
    it('Should update a todo', (done) => {
        //grap the id of first item
        let hexId = todos[0]._id.toHexString();
        //update text, set complete flag true
        let text = 'Updating the text using PATCH test script, mark it as done';
        request(app)
        .patch(`/todos/${hexId}`)
        .send({
            text: text,
            completed: true
        })
        .expect(200)
        .expect((res) => {
            expect(res.body.todo.text).toBe(text) ;
            expect(res.body.todo.completed).toBe(true);
            //toBeA is not working on Jest library
            expect(typeof res.body.todo.completedAt).toBe('number');
        })
        .end(done);
    }); 
    it('Should clear completedAt when todo is not completed', (done) => {
        //grap the id of first item
        let hexId = todos[1]._id.toHexString();
        let text = 'Updating the text using PATCH test script, mark it as incomplete';
        request(app)
        .patch(`/todos/${hexId}`)
        .send({
            completed: false,
            text: text
        })
        .expect(200)
        .expect((res) => {
            expect(res.body.todo.text).toBe(text);
            expect(res.body.todo.completed).toBe(false);   
            expect(res.body.todo.completedAt).toBeNull(); 
        })
        .end(done);
    });
    it('Should update completedAt date when todo is completed', (done) => {
        //grap the id of first item
        let hexId = todos[1]._id.toHexString();
        let text = 'Updating the text using PATCH test script, mark it as done';
        request(app)
            .patch(`/todos/${hexId}`)
            .send({
                completed: true,
                text
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(true);
                expect(typeof res.body.todo.completedAt).toBe('number');
            })
            .end(done);
    });
    it('Should return 404 for non-object ids', (done) => {
        let hexId = new ObjectId().toHexString();
        request(app)
            .patch(`/todos/${hexId}`)
            .send({
                completed: true
            })
            .expect(404)
            .end(done);
    });
    it('Should return 404 if object id is invalid', (done) => {
        let hexId = 'abc890';
        request(app)
            .delete(`/todos/${hexId.toString('hex')}`)
            .expect(404)
            .end(done);
    });
});

describe('GET /users/me', () => {
    it('should return user if authenticated', (done) => {

        request(app)
        .get('/users/me')
        .set('x-auth', users[1].tokens[0].token)
        .expect(200)
        .expect((res) => {
            expect(res.body._id).toBe(users[1]._id.toHexString());
            expect(res.body.email).toBe(users[1].email);
        })
        .end(done);
    });

    it('should return 401 if not authenticated', (done) =>{
        request(app)
        .get('/users/me')
        .expect(401)
        .expect((res) => {
            expect(res.body).toEqual({});
        })
        .end(done);
    });
});

describe('POST /users', () => {
   it('should create a new user', (done) => { 
        const email ='heaven@gmail.com';
        const password = 'takemetocloud';
        request(app)
        .post('/users')
        .send({email, password})
        .expect(200)
        .expect((res) =>{
            expect(res.headers['x-auth']).toBeTruthy();  //replacement to toExist()
            expect(res.body._id).toBeTruthy(); 
            expect(res.body.email).toBe(email);   
        })
        .end((err) => {

            if (err){
                return done(err);
            }
            User.findOne({email}).then((user) => {
                expect(user).toBeTruthy();
                expect(user.password).not.toBe(password);
                done();
            }).catch((err) => done(err));
         });
    });

    it('should not create same user', (done) => {
        const email = 'heaven@gmail.com';
        const password = 'takemetocloud';
        request(app)
            .post('/users')
            .send({
                email: users[0].email, 
                password: password})
            .expect(400)
            .end(done);
    } );

});

describe('POST users/login', () => {
    it('should login user and return auth token', (done) => {
        request(app)
        .post('/users/login')
        .send({
            email: users[1].email,
            password: users[1].password})
        .expect(200)
        .expect((res) => {
            expect(res.headers['x-auth']).toBeTruthy()
        })
         .end((err, res) => {
            if(err) {
                return done(err);
            } 
            User.findById(users[1]._id).then((user) => {
                expect(user.tokens[1].access).toBe('auth');
                expect(user.tokens[1].token).toBe(res.headers['x-auth']);
                done(); 
            }).catch((e) => done(e));    
        
         });
    });
    it('should reject (400) invalid login', (done) => {
        request(app)
        .post('/users/login')
        .send({
            email: 'Rakesh Rudra',
            password: 'Helloworld!'
        })
        .expect(400)
        .expect((res) =>{
            expect(res.headers['x-auth']).toBeFalsy();
        })
  /*       .end(done); */
        .end((err, res) => {
            if(err) {
                return done(err);
            }
            done(); 
         });
    });
});

describe('DELETE /users/me/token', () => {
    it('should remove auth token on logout', (done) => {
        
        request(app)
        .delete('/users/me/token')
        .set('x-auth', users[1].tokens[0].token)
        .expect(200)
        .end((err, res) => {
            if(err) {
                return done(err);
            }
            User.findById(users[1]._id).then((user) => {
                expect(user.tokens).toEqual(expect.arrayContaining([]));
                done();
            }).catch((e) => done(e));
        })

    });

    it('should not remove invalidauth token on logout', (done) => {

        request(app)
            .delete('/users/me/token')
            .set('x-auth', users[1].tokens[0].token + ' ')
            .expect(401)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                User.findById(users[1]._id).then((user) => {
                    expect(user.tokens).toEqual(expect.arrayContaining([]));
                    done();
                }).catch((e) => done(e));
            })

    });

});