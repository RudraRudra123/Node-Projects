var env = process.env.NODE_ENV || 'development' ;
console.log('Env ......', env);
var user ='rakesh';
var passwrd ='rakesh123'; 
if(env === 'development'){
    process.env.PORT = 3000; 
   process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
} else if(env === 'test'){
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
} else if (env === 'production') {
    //Mongolab database user: rakesh, passwd: rakesh123
    process.env.MONGODB_URI = 'mongodb://rakesh:rakesh123@ds257981.mlab.com:57981/rakesh_todotask';
}