//const { response } = require('express');
const express = require ('express');
const path = require ('path');
const bodyParser = require ('body-parser');
const database = require ('./database');
const app = express();
const router = express.Router();
const port = 3000;

app.use(express.static(path.join(__dirname, '../')));
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../html', 'index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../html', 'index.html'));
});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, '../html', 'signup.html'));
});

app.get('/instructorcreate', (req, res) => {
    res.sendFile(path.join(__dirname, '../html', 'instructorcreate.html'));
});

app.get('/instructorhome', (req, res) => {
    res.sendFile(path.join(__dirname, '../html', 'instructorhome.html'));
});

app.get('/instructorroster', (req, res) => {
    res.sendFile(path.join(__dirname, '../html', 'instructorroster.html'));
});

app.get('/studentcourses', (req, res) => {
    res.sendFile(path.join(__dirname, '../html', 'studentcourses.html'));
});

app.get('/studentenroll', (req, res) => {
    res.sendFile(path.join(__dirname, '../html', 'studentenroll.html'));
});

app.get('/studenthome', (req, res) => {
    res.sendFile(path.join(__dirname, '../html', 'studenthome.html'));
});

app.listen(port, () => {
    console.log(`Listening on Port:${port}`)
});

const findUserLogin = require("./database.js").findUserLogin;
app.post('/login', function(req, res) {
    
    var email = req.body.emailLogin;
    var password = req.body.passwordLogin;

    findUserLogin(email, password, function(err, user) {

        //First find out whether the user is a student or instructor or if it doesn't exist
        //Then send the user to the home page depending on what kind of user they are
        //Javascript should change the html so that in the name appears the name signed up with
        //ID should be object ID and done
    
    });


});

const createAndSaveStudent = require("./database.js").createAndSaveStudent;
const createAndSaveInstructor = require("./database.js").createAndSaveInstructor;
app.post('/signup', function(req, res) {

    var firstName = req.body.signupFirstName;
    var lastName = req.body.signupLastName;
    var email = req.body.signupEmail;
    var confirmEmail = req.body.signupConfirmEmail;
    var password = req.body.signupPassword;
    var confirmPassword = req.body.signupConfirmPassword;

    if(req.body.signupButton == 1){
        createAndSaveStudent(firstName, lastName, email, confirmEmail, password, confirmPassword, function (err, data) {
            if(err) return(err);
            res.sendFile(path.join(__dirname, '../html', 'studenthome.html'));
        });
    } else {
        createAndSaveInstructor(firstName, lastName, email, confirmEmail, password, confirmPassword, function (err, data) {
            if(err) return(err);
            res.sendFile(path.join(__dirname, '../html', 'instructorhome.html'));
        });
    }
})