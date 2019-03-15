//Calling the packages needed

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const User = require('./app/model/user');

const mongoose = require('mongoose');

const mongoDB = 'mongodb://127.0.0.1/users';
mongoose.connect(mongoDB, {useNewUrlParser: true});

//Getting the global promise
mongoose.Promise = global.Promise;

//Get default connection
var db = mongoose.connection;



//Bind connection connection to error event (to get notification for connection error)
db.on('error', console.error.bind(console, 'MongoDB connection error'))


//Configure the app to use body-parser
//This will enable us get the data from a POST 

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const PORT = process.env.PORT || 8080;


//Routes for our API
const router = express.Router();

//middleware to use for all request
router.use(function(request, response, next) {
    //do logging
    console.log('Something is happening.');
    next(); //make sure we go to the next routes and don't stop here
})

//Test route to make sure everything is working
router.get("/", function(request,response) {
    response.json({message: 'Hoorayy, welcome to my API!!'});
});

//more routes for our API will happen here

//REGISTER OUR ROUTES =====================
//All of our routes will be prefixed with /api

//on routes that ends in /users
router.route('/users')

    //Create a user (access at POST http://localhost:8080/api/users)
    .post(function(request, response) {
        const user = new User();
        user.name = request.body.name;
        user.age = request.body.age;
        user.sex = request.body.sex;
        user.email = request.body.email;

        //save the user and check for errors
        user.save(function(err) {
            if (err) {
                response.send(err)
            }
            response.json({message: 'User created'});
        })
    })

    //Get all users
    .get(function(request, response) {
        User.find(function(err, users) {
            if (err) {
                response.send(err);
            }

            response.json(users);
        })
    })

//Register routes that ends in /users/:user_id

router.route('/users/:user_id')

    //Get the user with id
    .get(function(request, response) {
        User.findById(request.params.user_id, function(err, user) {
            if (err) {
                response.send(err);
            }
            response.json(user);
        })
    })

    //Update the user with this id
    .put(function(request, response) {
        //use our user model to find the user we want
        User.findById(request.params.user_id, function(err, user) {
            if (err)
                response.send(err);

            user.name = request.body.name || user.name;
            user.age = request.body.age || user.age;
            user.sex = request.body.sex || user.sex;
            user.email = request.body.email || user.email;      
            user.save(function(err) {
                if (err)
                    response.send(err);

                response.json({message: 'User updated'});    
            })      
        })
        
    })

    //delete the user with this id
    .delete(function(request, resposne) {
        user.remove({
            _id: request.params.user_id
        }, function(err, user) {
                if (err)
                    resposne.send(err);
                
                resposne.json({message: 'Successfully deleted'});
        });
    });


app.use("/api", router);

//START THE SERVER
//=========================================


app.listen(PORT);

console.log("Magic happens on port " + PORT);
