const express     = require('express');
const app         = express();
const port        = 3050;
const MongoClient = require('mongodb').MongoClient;
const url         = "mongodb://localhost:27017/nodejsDB";
var bodyParser = require('body-parser')
app.use( bodyParser.json() );      
app.use(bodyParser.urlencoded({     
  extended: true
}));



var dbo = null;


function checkUserAccount(username,password,res){
    var userStatu= null;
    var query = { name: username, password: password};
    dbo.collection("users").find(query).toArray(function(err, result) {
        if(err){ throw err; };
        if(typeof result[0] !== 'undefined'){ 
            userStatu = 'Accepted';
            res.send("Welcome back => "+ username);
        }else{
             userStatu = 'wrong'; 
             res.send("No user found :(");
            }

        
    });
}

function addUsers(res) {
    var myUsers = [
            { name: 'Alaa', password: '123456789'},
            { name: 'Mohamed', password: '12345678'},
            { name: 'Hassan', password: '1234567'},
            { name: 'Waleed', password: '123456'},
            { name: 'Ramz', password: '12345'}
        ];
    dbo.collection("users").insertMany(myUsers, function(err) {
    if (err) throw err;
        console.log("Added data to database...");
        console.log(myUsers);
        res.send('Added Users to database...:\n Done');
    });
}


function deletUsers(res) {
    dbo.collection("users").drop(function(err, delOK) {
        if (err) throw err;
        if (delOK){ console.log("Users Table Deleted")};
             res.send('Users Table Deleted');
         });
}


app.post('/',function(req,res){
    
    
    
    MongoClient.connect(url,function(err,db){
        if(err){ throw err; }
        dbo = db.db("nodejsDB");   

        username = req.body.username;
        password = req.body.password;
        console.log(req.body);
        if(username == 'del' && password == 'del'){
            deletUsers(res);
        }else if(username == 'ins' && password == 'ins'){
            addUsers(res);
        }else{
            checkUserAccount(username,password,res);
        }
    
        db.close();
    });


    
});


app.listen(port,()=> console.log(`listening to port: ${port}`))
