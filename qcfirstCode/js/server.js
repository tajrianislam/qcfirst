const express = require ('express');
const path = require ('path');
const bodyParser = require ('body-parser');
const cheerio = require('cheerio');
const database = require ('./database');
const fs = require('fs'); 
const app = express();
const router = express.Router();
const port = 3000;

app.use(express.static(path.join(__dirname, '../')));
app.use(bodyParser.urlencoded({extended: true}));
app.set('../html');
app.set('view engine', 'ejs')

var fullName = "";
var id = "";
var studentLoggedIn = false;
var instructorLoggedIn = false;


app.get('/', (req, res) => {
    res.render('index', {loginmessage: ''});
});

app.get('/login', (req, res) => {
    if(studentLoggedIn) {
        res.redirect('/studenthome')
    } else if (instructorLoggedIn) {
        res.redirect('/instructorhome')
    } else {
         res.render('index', {loginmessage: ''});
    }
});

app.get('/login_successfulSignup', (req, res) => {
    if(studentLoggedIn) {
        res.redirect('/studenthome')
    } else if (instructorLoggedIn) {
        res.redirect('/instructorhome')
    } else {
        res.render('index', {loginmessage: '<h2 class="successful">Successful Signup! Sign in </h2>'});
    }
});

app.get('/signup', (req, res) => {
    if(studentLoggedIn) {
        res.redirect('/studenthome')
    } else if (instructorLoggedIn) {
        res.redirect('/instructorhome')
    } else {
        res.render('signup', {signupmessage: ''});
    }
});

app.get('/instructorcreate', (req, res) => {
    if(instructorLoggedIn){
        res.render("instructorcreate");
    } else {
        res.redirect("/login");
    }
});

app.get('/instructorhome', (req, res) => {
    if(instructorLoggedIn){
        res.render("instructorhome", {instructorName: fullName, instructorID: id});
    } else {
        res.redirect("/login");
    }
});

app.get('/instructorroster', (req, res) => {
    if(instructorLoggedIn){
        res.render("instructorroster");
    } else {
        res.redirect("/login");
    }
});

app.get('/studentcourses', (req, res) => {
    if(studentLoggedIn){
        res.render("studentcourses");
    } else {
        res.redirect("/login");
    }
});

app.get('/studentenroll', (req, res) => {
    if(studentLoggedIn){
        res.render("studentenroll");
    } else {
        res.redirect("/login");
    }
});

app.get('/studenthome', (req, res) => {
    if(studentLoggedIn){
    res.render("studenthome", {studentName: fullName, studentID: id});
    } else {
        res.redirect("/login");
    }
});

app.listen(port, () => {
    console.log(`Listening on Port:${port}`)
});

app.post('/logout', function(req, res) {
    instructorLoggedIn = false;
    studentLoggedIn = false;
    
    res.redirect('/login');
})

const findStudentLogin = require("./database.js").findStudentLogin;
const findInstructorLogin = require("./database.js").findInstructorLogin;
app.post('/login', function(req, res) {
    
    var email = req.body.emailLogin;
    var password = req.body.passwordLogin;
    
    var firstName = "";
    var lastName = "";

    if(req.body.loginButton == 1){
        findStudentLogin(email, password, function(err, student) {
            
            if (err) return console.error(err);

            if(student == ""){
                res.render("index", {loginmessage: '<h2 class="invalid"> Invalid Login </h2>'});
            } else {
                var studentJSON = JSON.stringify(student);
                var studentInfo = JSON.parse(studentJSON);

                for (var i = 0; i < studentInfo.length; i++) {
                    firstName = (studentInfo[i]['firstName']);
                    lastName = (studentInfo[i]['lastName']);
                    id = (studentInfo[i]['_id']);
                }

                fullName = firstName + " " + lastName;

                fullName = firstName + " " + lastName;
                instructorLoggedIn = false;
                studentLoggedIn = true;

                res.redirect("studenthome");
            }
        });
    } else if(req.body.loginButton == 2) {
        findInstructorLogin(email, password, function(err, instructor) {
            
            if (err) return console.error(err);

            if(instructor == ""){
                res.render("index", {loginmessage: '<h2 class="invalid"> Invalid Login </h2>'});
            } else {
                var instructorJSON = JSON.stringify(instructor);
                var instructorInfo = JSON.parse(instructorJSON);

                for (var i = 0; i < instructorInfo.length; i++) {
                    firstName = (instructorInfo[i]['firstName']);
                    lastName = (instructorInfo[i]['lastName']);
                    id = (instructorInfo[i]['_id']);
                }

                fullName = firstName + " " + lastName;
                instructorLoggedIn = true;
                studentLoggedIn = false;

                res.redirect("instructorhome");
            }
        });
    } else if (req.body.loginButton == 3){
            res.redirect("/signup");
    }
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
            if(err){
                return(err);
            }else if(!data){
                res.render("signup", {signupmessage: '<h2 class="invalid"> Invalid Signup </h2>'});
            } else {
                res.redirect("/login_successfulSignup");
            }
        });
    } else if(req.body.signupButton == 2) {
        createAndSaveInstructor(firstName, lastName, email, confirmEmail, password, confirmPassword, function (err, data) {
            if(err){
                return(err);
            }else if(!data){
                res.render("signup", {signupmessage: '<h2 class="invalid"> Invalid Signup </h2>'});
            } else {
                res.redirect("/login_successfulSignup");
            }
        });
    } else if(req.body.signupButton == 3) {
        res.redirect("/login");
    }
});