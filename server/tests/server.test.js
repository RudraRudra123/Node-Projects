const expect = require('expect');
const request = require('supertest') ;
var bodyParser = require('body-parser');

const {app} = require('./../server');
const {Todo} = require('./../models/Todo');



beforeEach((done) => {
    console.log('Remove collection before reach run..'); 
    Todo.remove({}).then(() => done());
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
                expect(todos.length).toBe(1);
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
                    expect(todos.length).toBe(0);
                    done();
                    
                }).catch((e) => {
                    console.log('Errored out');
                    done(e);});
            });

    });
});

