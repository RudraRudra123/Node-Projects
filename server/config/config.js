var env = process.env.NODE_ENV || 'development' ;
console.log('Env ......', env);

if(env === 'development'){
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
} else if(env === 'test'){
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
} else if (env === 'production') {
    process.env.MONGODB_URI = 'mongodb://Rakesh R:Rakesh123$@ds257981.mlab.com:57981/rakesh_todotask'
}