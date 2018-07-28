const expect = require('expect');
const request = require('supertest') ;
const {ObjectId} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/Todo');
var bodyParser = require('body-parser');
//for GET operation create a collection todos 
const todos = [{
    _id: new ObjectId(),
    text: 'Todo note for GET request 1'
},{
    _id: new ObjectId(),
    text: 'Todo note for GET request 2'
}];

//Before each POST 
beforeEach((done) => {
    console.log('Remove collection before reach run..'); 
    Todo.remove({}).then(() => {            //remove old records
        return Todo.insertMany(todos) ;    // insert two records from above collection 
    }).then(() => done());
});
describe('POST /todos', () => {
    it('should create new todo--', (done) => {
        var text = 'Test todo text';

        request(app)
        .post('/todos')
        .send({text})
        .expect(200)
        .expect((res) => {
            console.log('you have hit res obj verification code'); 
            expect(res.body.text).toBe(text);
            //done();
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
