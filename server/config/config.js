let env = process.env.NODE_ENV||'development' ;
console.log('Environment is...', env);

process.env.JWT_SECRET = 'suhas123';

if(env === 'development') {
    process.env.PORT = 3000; 
   process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
   
} else if(env === 'test') {
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
} else if (env === 'production') {

    //Environment variables for production env are set in heroku env variables list
    // heroku config: set 
    //heroku config: set process.env.JWT_SECRET = 'ds345#$@!mksdf'
    //heroku config: set process.env.MONGODB_URI = 'mongodb://rakesh:rakesh123@ds257981.mlab.com:57981/rakesh_todotask'
    //Mongolab database user: rakesh, passwd: rakesh123
    //process.env.MONGODB_URI = 'mongodb://rakesh:rakesh123@ds257981.mlab.com:57981/rakesh_todotask';
}