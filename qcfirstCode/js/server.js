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

const findStudentLogin = require("./database.js").findStudentLogin;
const findInstructorLogin = require("./database.js").findInstructorLogin;
app.post('/login', function(req, res) {
    
    var email = req.body.emailLogin;
    var password = req.body.passwordLogin;
    
    var firstName = "";
    var lastName = "";
    var id = "";

    if(req.body.loginButton == 1){
        findStudentLogin(email, password, function(err, student) {
            
            if (err) return console.error(err);

            if(student == ""){
                console.log("Invalid login credentials");
                res.redirect("/login");
            } else {
                var studentJSON = JSON.stringify(student);
                var studentInfo = JSON.parse(studentJSON);

                for (var i = 0; i < studentInfo.length; i++) {
                    firstName = (studentInfo[i]['firstName']);
                    lastName = (studentInfo[i]['lastName']);
                    id = (studentInfo[i]['_id']);
                }

                var fullName = firstName + " " + lastName;

                res.redirect("/studenthome");
                fs.readFile('../html/studenthome.html', 'utf8', function(error, data) {

                    if (error) throw error;
                
                    var $ = cheerio.load(data);
                
                    $('#studentName').html(fullName);
                    $('#studentID').html(id);

                    fs.writeFile('../html/studenthome.html', $.html(), function(e, d) {
                        if (e) throw e;
                    });
                });
            }
        });
    } else if(req.body.loginButton == 2) {
        findInstructorLogin(email, password, function(err, instructor) {
            
            if (err) return console.error(err);

            if(instructor == ""){
                console.log("Invalid login credentials");
                res.redirect("/login");
            } else {
                var instructorJSON = JSON.stringify(instructor);
                var instructorInfo = JSON.parse(instructorJSON);

                for (var i = 0; i < instructorInfo.length; i++) {
                    firstName = (instructorInfo[i]['firstName']);
                    lastName = (instructorInfo[i]['lastName']);
                    id = (instructorInfo[i]['_id']);
                }

                var fullName = firstName + " " + lastName;

                res.redirect("/instructorhome");
                fs.readFile('../html/instructorhome.html', 'utf8', function(error, data) {

                    if (error) throw error;
                
                    var $ = cheerio.load(data);
                
                    $('#instructorName').html(fullName);
                    $('#instructorID').html(id);

                    fs.writeFile('../html/instructorhome.html', $.html(), function(e, d) {
                        if (e) throw e;
                    });
                });
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
            if(err) return(err);
            res.sendFile(path.join(__dirname, '../html', 'studenthome.html'));
        });
    } else if(req.body.signupButton == 2) {
        createAndSaveInstructor(firstName, lastName, email, confirmEmail, password, confirmPassword, function (err, data) {
            if(err) return(err);
            res.sendFile(path.join(__dirname, '../html', 'instructorhome.html'));
        });
    } else if(req.body.signupButton == 3) {
        res.redirect("/login");
    }
});