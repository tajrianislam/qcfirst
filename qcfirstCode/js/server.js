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
var courses = "";
var rosterSelect = "";
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
        res.sendFile(path.join(__dirname, '../html', 'instructorcreate.html'));
    } else {
        res.redirect("/login");
    }
});

app.get('/instructorhome', (req, res) => {
    if(instructorLoggedIn){
        res.render("instructorhome", {instructorName: fullName, instructorID: id, instructorCourses: courses, successMessage: ""});
    } else {
        res.redirect("/login");
    }
});

app.get('/instructorhome_successfulCreateCourse', (req, res) => {
    if(instructorLoggedIn){
        res.render("instructorhome", {instructorName: fullName, instructorID: id, instructorCourses: courses, successMessage: '<h2 class="successful">Success creating course! </h2>'});
    } else {
        res.redirect("/login");
    }
});

app.get('/instructorroster', (req, res) => {
    if(instructorLoggedIn){
        res.render("instructorroster", {courseRoster: rosterSelect});
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
    var courseList = [];

    if(req.body.loginButton == 1){
        findStudentLogin(email, password, function(err, student) {
            
            if (err) return console.error(err);

            if(student == ""){
                res.render("index", {loginmessage: '<h2 class="invalid"> Invalid Login </h2>'});
            } else {

                for (var i = 0; i < student.length; i++) {
                    firstName = (student[i]['firstName']);
                    lastName = (student[i]['lastName']);
                    id = (student[i]['_id']);
                }
               
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

                for (let i = 0; i < instructor.length; i++) {
                    firstName = (instructor[i]['firstName']);
                    lastName = (instructor[i]['lastName']);
                    id = (instructor[i]['_id']);
                    courseList = (instructor[i]['coursesTeaching']);
                }

                fullName = firstName + " " + lastName;
                
                courses = "";
                rosterSelect = "";

                for(let x = 0; x < courseList.length; x++){
                    courses += `<tr><td>${courseList[x].courseNumberName}</td><td>${courseList[x].courseDaysTime}</td></tr>`
                    rosterSelect += `<option value="${courseList[x].courseID}">${courseList[x].courseID}` + " : " + `${courseList[x].courseNumberName}</option>`
                }

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

    var passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    if(req.body.signupButton == 3) {
        res.redirect("/login");
    } else if(firstName == "" || lastName == "") {
        res.render("signup", {signupmessage: '<h2 class="invalid"> Name cannot be empty! </h2>'});
        return;
    } else if(email == "" || confirmEmail == ""){
        res.render("signup", {signupmessage: '<h2 class="invalid"> Email cannot be empty! </h2>'});
        return;
    } else if(password == "" || confirmPassword == ""){
        res.render("signup", {signupmessage: '<h2 class="invalid"> Password cannot be empty! </h2>'});
        return;
    }else if(email != confirmEmail) {
        res.render("signup", {signupmessage: '<h2 class="invalid"> Emails do not match! </h2>'});
        return;
    } else if(password != confirmPassword) {
        res.render("signup", {signupmessage: '<h2 class="invalid"> Passwords do not match! </h2>'});
        return;
    } else if(!password.match(passwordRegex)) {
        res.render("signup", {signupmessage: '<h2 class="invalid"> Password does not fulfill requirements! </h2>'});
        return;
    }

    if(req.body.signupButton == 1) {
        createAndSaveStudent(firstName, lastName, email, password, function (err, data) {
            if(err){
                return(err);
            }else if(!data){
                res.render("signup", {signupmessage: '<h2 class="invalid"> Email already exists! </h2>'});
            } else {
                res.redirect("/login_successfulSignup");
            }
        });
    } else if(req.body.signupButton == 2) {
        createAndSaveInstructor(firstName, lastName, email, password, function (err, data) {
            if(err){
                return(err);
            }else if(!data){
                res.render("signup", {signupmessage: '<h2 class="invalid"> Email already exists! </h2>'});
            } else {
                res.redirect("/login_successfulSignup");
            }
        });
    }
});

const createAndSaveCourse = require("./database.js").createAndSaveCourse;
const addCourseToInstructor = require("./database.js").addCourseToInstructor;
app.post('/createClass', function(req, res) { 
    
    var semester = req.body.createCourseSemester;
    var department = req.body.createCourseDepartment;
    var numberName = req.body.createCourseNumber;
    var days = req.body.createCourseDays;
    var time = req.body.createCourseClassTime;
    var capacity = req.body.createCourseCapacity;
    var description = req.body.createCourseDescription;

    createAndSaveCourse(semester, department, numberName, days, time, fullName, capacity, description, function(err, data) {
        if(err){
            return(err);
        }else if(data){
            let dayTimeString = days + " " + time;
            courses += `<tr><td>${numberName}</td><td>${dayTimeString}</td></tr>`
            rosterSelect += `<option value="${data.courseID}">${data.courseID}` + " : " + `${numberName}</option>`
            addCourseToInstructor(id, data.courseID, numberName, dayTimeString);
            res.redirect("/instructorhome_successfulCreateCourse");
        } 
    });
});

const findCourseInformation = require("./database.js").findCourseInformation;
app.post('/showRoster', function(req, res) {

    var courseID = req.body.rosterCourseLookup;

    findCourseInformation(courseID, function(err, course) {
        //console.log(course[0].courseDescription);
        //Here parse information and re-render page with the course information
    });

});