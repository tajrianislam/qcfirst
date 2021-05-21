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
var adminLoggedIn = false;

// Instructor Variables
var coursesTeaching = "";
var selectRosterInstructor = "";
var rosterOfCourse = "";
var coursesForDelete = "";

// Student Variables
var studentClassesEnroll = "";
var studentClassesEnrolledIn = "";

// Admin Variables
var adminTable = "";

app.get('/', (req, res) => {
    res.render('index', {loginmessage: ''});
});

app.get('/login', (req, res) => {
    if(studentLoggedIn) {
        res.redirect('/studenthome')
    } else if(instructorLoggedIn) {
        res.redirect('/instructorhome')
    } else if(adminLoggedIn){
        res.redirect('/adminhome')
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
        res.render("instructorhome", {instructorName: fullName, instructorID: id, instructorCourses: coursesTeaching, successMessage: ""});
    } else {
        res.redirect("/login");
    }
});

app.get('/instructorhome_successfulCreateCourse', (req, res) => {
    if(instructorLoggedIn){
        res.render("instructorhome", {instructorName: fullName, instructorID: id, instructorCourses: coursesTeaching, successMessage: '<h2 class="successful">Success creating course! </h2>'});
    } else {
        res.redirect("/login");
    }
});

app.get('/instructorhome_errorCreatingCourse', (req, res) => {
    if(instructorLoggedIn){
        res.render("instructorhome", {instructorName: fullName, instructorID: id, instructorCourses: coursesTeaching, successMessage: '<h2 class="invalid"> Course has time conflict with another course! </h2>'});
    } else {
        res.redirect("/login");
    }
});

app.get('/instructorhome_successfulDelete', (req, res) => {
    if(instructorLoggedIn){
        res.render("instructorhome", {instructorName: fullName, instructorID: id, instructorCourses: coursesTeaching, successMessage: '<h2 class="successful">Success deleting course! </h2>'});
    } else {
        res.redirect("/login");
    }
});

app.get('/instructorroster', (req, res) => {
    if(instructorLoggedIn){
        res.render("instructorroster", {possibleCourseRoster: selectRosterInstructor, roster: ""});
    } else {
        res.redirect("/login");
    }
});

app.get('/instructordelete', (req, res) => {
    if(instructorLoggedIn){
        res.render("instructordelete", {coursesToDelete: coursesForDelete});
    } else {
        res.redirect("/login");
    }
});

app.get('/studentcourses', (req, res) => {
    if(studentLoggedIn){
        res.render("studentcourses", {coursemessage: "", possiblecourses: studentClassesEnroll});
    } else {
        res.redirect("/login");
    }
});

app.get('/studentcourses_dne', (req, res) => {
    if(studentLoggedIn){
        res.render("studentcourses", {coursemessage: '<h2 class="invalid"> No courses exist! </h2>', possiblecourses: ""});
    } else {
        res.redirect("/login");
    }
});

app.get('/studentenroll', (req, res) => {
    if(studentLoggedIn){
        res.sendFile(path.join(__dirname, '../html', 'studentenroll.html'));
    } else {
        res.redirect("/login");
    }
});

app.get('/studenthome', (req, res) => {
    if(studentLoggedIn){
    res.render("studenthome", {studentName: fullName, studentID: id, courseAddingMessage: "", studentenrolledcourses: studentClassesEnrolledIn});
    } else {
        res.redirect("/login");
    }
});

app.get('/studenthome_successfulAdd', (req, res) => {
    if(studentLoggedIn){
        res.render("studenthome", {studentName: fullName, studentID: id, courseAddingMessage: '<h2 class="successful"> Course Added Successfully </h2>', studentenrolledcourses: studentClassesEnrolledIn});
    } else {
        res.redirect("/login");
    }
});

app.get('/adminhome', (req, res) => {
    if(adminLoggedIn){
        adminTable = "";
        res.render("adminhome", {adminTableInfo: ""});
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
    adminLoggedIn = false;
    
    res.redirect('/login');
})

const findStudentLogin = require("./database.js").findStudentLogin;
const findInstructorLogin = require("./database.js").findInstructorLogin;
const findAdminLogin = require("./database.js").findAdminLogin;
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

                firstName = student[0].firstName;
                lastName = student[0].lastName;
                id = student[0]._id;
                courseList = student[0].coursesEnrolled;

                fullName = firstName + " " + lastName;
                
                studentClassesEnrolledIn = "";

                for(let course of courseList){
                    studentClassesEnrolledIn += `<tr><td>${course.courseID}</td><td>${course.courseSemester}</td><td>${course.courseNumberName}</td><td>${course.courseDays} ${course.courseTime}</td><td>${course.courseProfessor}</td></tr>`;
                }

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
               
                firstName = instructor[0].firstName;
                lastName = instructor[0].lastName;
                id = instructor[0]._id;
                let courseList = instructor[0].coursesTeaching;

                fullName = firstName + " " + lastName;
                
                coursesTeaching = "";
                selectRosterInstructor = "";
                coursesForDelete = ""

                for(let course of courseList){
                    coursesTeaching += `<tr><td>${course.courseID}</td><td>${course.courseSemester}</td><td>${course.courseNumberName}</td><td>${course.courseDays} ${course.courseTime}</td></tr>`;
                    selectRosterInstructor += `<option value="${course.courseID}">${course.courseID}` + " : " + `${course.courseNumberName}</option>`;
                    coursesForDelete += `<form method="post" action="/deletecourse"><tr><td><input type="hidden" name="classID" value="${course.courseID}">${course.courseID}</td><td>${course.courseNumberName}</td><td>${course.courseDays} ${course.courseTime}</td><td><button class = "addCourseButton">Delete Course</button></td></tr></form>`
                }

                instructorLoggedIn = true;

                res.redirect("instructorhome");
            }
        });
    } else if(req.body.loginButton == 3){
        findAdminLogin(email, password, function(err, admin) {
            
            if (err) return console.error(err);

            if(admin == ""){
                res.render("index", {loginmessage: '<h2 class="invalid"> Invalid Login </h2>'});
            } else {
                adminLoggedIn = true;
                res.redirect("/adminhome");
            }
        });

    } else if(req.body.loginButton == 4){
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
    } else if(email != confirmEmail) {
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
            if(err) {
                return(err);
            } else if(data == null) {
                res.render("signup", {signupmessage: '<h2 class="invalid"> Email already exists! </h2>'});
            } else if(data) {
                res.redirect("/login_successfulSignup");
            }
        });
    } else if(req.body.signupButton == 2) {
        createAndSaveInstructor(firstName, lastName, email, password, function (err, data) {
            if(err) {
                return(err);
            } else if(data == null) {
                res.render("signup", {signupmessage: '<h2 class="invalid"> Email already exists! </h2>'});
            } else if(data) {
                res.redirect("/login_successfulSignup");
            }
        });
    } 
});

const createAndSaveCourse = require("./database.js").createAndSaveCourse;
const addCourseToInstructor = require("./database.js").addCourseToInstructor;
const findInstructorByID = require("./database.js").findInstructorByID;
const checkForCreateTimeConflicts = require("./helperfunctions").checkForCreateTimeConflicts;
app.post('/createClass', function(req, res) { 
    
    var semester = req.body.createCourseSemester;
    var department = req.body.createCourseDepartment;
    var numberName = req.body.createCourseNumber;
    var days = req.body.createCourseDays;
    var time = req.body.createCourseClassTime;
    var capacity = req.body.createCourseCapacity;
    var description = req.body.createCourseDescription;

    findInstructorByID(id, function(err, instructor) {

        let instructorCourses = instructor[0].coursesTeaching;

        if(instructorCourses.length == 0) {
            createAndSaveCourse(semester, department, numberName, days, time, fullName, capacity, description, function(err, data) {
                if(err){
                    return(err);
                } else if(data){
                    coursesTeaching += `<tr><td>${data.courseID}</td><td>${semester}</td><td>${numberName}</td><td>${days} ${time}</td></tr>`
                    selectRosterInstructor += `<option value="${data.courseID}">${data.courseID}` + " : " + `${numberName}</option>`
                    coursesForDelete += `<form method="post" action="/deletecourse"><tr><td><input type="hidden" name="classID" value="${data.courseID}">${data.courseID}</td><td>${numberName}</td><td>${days} ${time}</td><td><button class = "addCourseButton">Delete Course</button></td></tr></form>`
                    addCourseToInstructor(id, data.courseID, data.semester, numberName, days, time);
                    res.redirect("/instructorhome_successfulCreateCourse");
                } 
            });
        } else {
            
            var noConflict = true;

            for(let instructorCourse of instructorCourses) {
                
                if(instructorCourse.courseSemester == semester && !checkForCreateTimeConflicts(instructorCourse, days, time)) {
                    noConflict = false;
                }
            }

            if(noConflict) {
                createAndSaveCourse(semester, department, numberName, days, time, fullName, capacity, description, function(err, data) {
                    if(err){
                        return(err);
                    } else if(data){
                        coursesTeaching += `<tr><td>${data.courseID}</td><td>${semester}</td><td>${numberName}</td><td>${days} ${time}</td></tr>`
                        selectRosterInstructor += `<option value="${data.courseID}">${data.courseID}` + " : " + `${numberName}</option>`
                        coursesForDelete += `<form method="post" action="/deletecourse"><tr><td><input type="hidden" name="classID" value="${data.courseID}">${data.courseID}</td><td>${numberName}</td><td>${days} ${time}</td><td><button class = "addCourseButton">Delete Course</button></td></tr></form>`
                        addCourseToInstructor(id, data.courseID, data.semester, numberName, days, time);
                        res.redirect("/instructorhome_successfulCreateCourse");
                    } 
                });
            } else if(!noConflict) {
                res.redirect("/instructorhome_errorCreatingCourse")
            }
        } 
    });
});

const findCourseInformation = require("./database.js").findCourseInformation;
app.post('/showRoster', function(req, res) {

    var courseID = req.body.rosterCourseLookup;

    if(courseID == null) {
        res.redirect('/instructorroster');
    } else { 

        findCourseInformation(courseID, function(err, course) {

            rosterOfCourse = "";
            
            for(let studentInfo of course[0].studentsEnrolled){
                rosterOfCourse += `<tr><td>${studentInfo.studentName}</td><td>${studentInfo.studentEmail}</td></tr>`
            }

            res.render('instructorroster', {possibleCourseRoster: selectRosterInstructor, roster: rosterOfCourse});
        });
    }
});

const deleteCourseFromInstructor = require("./database.js").deleteCourseFromInstructor;
app.post('/deletecourse', function(req,res) {

    var courseID = req.body.classID;

    deleteCourseFromInstructor(id, courseID, (err, instructor) => {
        
        coursesTeaching = "";
        selectRosterInstructor = "";
        rosterOfCourse = "";
        coursesForDelete = "";

        let courseList = instructor.coursesTeaching;
    
        for(let course of courseList){
            if(course.courseID != courseID){
                coursesTeaching += `<tr><td>${course.courseID}</td><td>${course.courseSemester}</td><td>${course.courseNumberName}</td><td>${course.courseDays} ${course.courseTime}</td></tr>`;
                selectRosterInstructor += `<option value="${course.courseID}">${course.courseID}` + " : " + `${course.courseNumberName}</option>`;
                coursesForDelete += `<form method="post" action="/deletecourse"><tr><td><input type="hidden" name="classID" value="${course.courseID}">${course.courseID}</td><td>${course.courseNumberName}</td><td>${course.courseDays} ${course.courseTime}</td><td><button class = "addCourseButton">Delete Course</button></td></tr></form>`
            }
        }

        res.redirect('/instructorhome_successfulDelete');
    });
});    

const findClassWithSearch = require("./database.js").findClassWithSearch;
const createAndSaveSearchForStudent = require("./database.js").createAndSaveSearchForStudent;
const findStudentSearch = require("./database.js").findStudentSearch;
const addSearchTermToStudent = require("./database.js").addSearchTermToStudent;
const findClassForEnrollWithID = require("./database.js").findClassForEnrollWithID;
const findClassForEnrollWithSubjectAndNumber = require("./database.js").findClassForEnrollWithSubjectAndNumber;
const findAllCourses = require("./database.js").findAllCourses;
app.post('/findClass', function(req, res) {

    var search = req.body.searchBar;
    var classID = req.body.classId;
    var subject = req.body.subjectEnroll;
    var courseNumber = req.body.courseNumberEnroll;

    if(search != ""){

        findClassWithSearch(search, function(err, courses) {
            
            findStudentSearch(id, function(e, searchStudent) {
                if (e) console.error(e);

                if(searchStudent == "") {

                    createAndSaveSearchForStudent(id, fullName, search, function(error, data) {
                        if (err) console.error(error);
                    });

                } else {
                    addSearchTermToStudent(id, search);
                }
            });
            
            if(courses == ""){
                res.redirect('/studentcourses_dne');
            } else {
            studentClassesEnroll = "";
                
                for(let courseInfo of courses){
                    
                    let month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                    let deadline = month[(courseInfo.enrollmentDeadline.getMonth())] + " " + courseInfo.enrollmentDeadline.getDate() + " " + courseInfo.enrollmentDeadline.getFullYear();
                    
                    studentClassesEnroll += 
                    `<form method="post" action="/addClass">
                        <table class = "bigTable tableSpace" id="studentCourseTable">
                            <tr>
                                <th scope = "col">Course ID</th>
                                <th scope = "col">Course Name</th>
                                <th scope = "col">Course Time</th>
                                <th scope = "col">Professor</th>
                                <th scope = "col">Select</th>
                            </tr>
                            <tr>
                                <td><input type="hidden" name="classID" value="${courseInfo.courseID}">${courseInfo.courseID}</td>
                                <td>${courseInfo.courseNumberName}</td>
                                <td>${courseInfo.courseDays} ${courseInfo.courseTime}</td>
                                <td>${courseInfo.courseProfessor}</td>
                                <td rowspan="3"><button class = "addCourseButton">Add Course</button></td>
                            </tr>
                            <tr>
                                <th scope = "col">Semester</th>
                                <th scope = "col">Description</th>
                                <th scope = "col">Deadline</th>
                                <th scope = "col">Capacity</th>
                            </tr>
                            <tr>
                                <td>${courseInfo.semester}</td>
                                <td>${courseInfo.courseDescription}</td>
                                <td>${deadline}</td>
                                <td>${courseInfo.studentsEnrolled.length}/${courseInfo.courseCapacity}</td>
                            </tr>
                        </table>
                    </form>`
                }

                res.redirect('/studentcourses');
            }
        });

    } else if(classID != ""){

        findClassForEnrollWithID(classID, function(err, course) {
            
            if(course == ""){
                res.redirect('/studentcourses_dne');
            } else {
                
                studentClassesEnroll = "";
                
                let month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                let deadline = month[(course[0].enrollmentDeadline.getMonth())] + " " + course[0].enrollmentDeadline.getDate() + " " + course[0].enrollmentDeadline.getFullYear();
                
                studentClassesEnroll +=
                `<form method="post" action="/addClass">
                <table class = "bigTable tableSpace" id="studentCourseTable">
                    <tr>
                        <th scope = "col">Course ID</th>
                        <th scope = "col">Course Name</th>
                        <th scope = "col">Course Time</th>
                        <th scope = "col">Professor</th>
                        <th scope = "col">Select</th>
                    </tr>
                    <tr>
                        <td><input type="hidden" name="classID" value="${course[0].courseID}">${course[0].courseID}</td>
                        <td>${course[0].courseNumberName}</td>
                        <td>${course[0].courseDays} ${course[0].courseTime}</td>
                        <td>${course[0].courseProfessor}</td>
                        <td rowspan="3"><button class = "addCourseButton">Add Course</button></td>
                    </tr>
                    <tr>
                        <th scope = "col">Semester</th>
                        <th scope = "col">Description</th>
                        <th scope = "col">Deadline</th>
                        <th scope = "col">Capacity</th>
                    </tr>
                    <tr>
                        <td>${course[0].semester}</td>
                        <td>${course[0].courseDescription}</td>
                        <td>${deadline}</td>
                        <td>${course[0].studentsEnrolled.length}/${course[0].courseCapacity}</td>
                    </tr>
                </table>
            </form>`
                res.redirect('/studentcourses');
            }
        });

    } else if(subject != null && courseNumber != null) {

        findClassForEnrollWithSubjectAndNumber(subject, courseNumber, function(err, course) {

            if(course == ""){
                res.redirect('/studentcourses_dne');
            } else {
                
                studentClassesEnroll = "";
                
                for(let courseInfo of course){
                    
                    let month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                    let deadline = month[(courseInfo.enrollmentDeadline.getMonth())] + " " + courseInfo.enrollmentDeadline.getDate() + " " + courseInfo.enrollmentDeadline.getFullYear();
                    
                    studentClassesEnroll += 
                    `<form method="post" action="/addClass">
                        <table class = "bigTable tableSpace" id="studentCourseTable">
                            <tr>
                                <th scope = "col">Course ID</th>
                                <th scope = "col">Course Name</th>
                                <th scope = "col">Course Time</th>
                                <th scope = "col">Professor</th>
                                <th scope = "col">Select</th>
                            </tr>
                            <tr>
                                <td><input type="hidden" name="classID" value="${courseInfo.courseID}">${courseInfo.courseID}</td>
                                <td>${courseInfo.courseNumberName}</td>
                                <td>${courseInfo.courseDays} ${courseInfo.courseTime}</td>
                                <td>${courseInfo.courseProfessor}</td>
                                <td rowspan="3"><button class = "addCourseButton">Add Course</button></td>
                            </tr>
                            <tr>
                                <th scope = "col">Semester</th>
                                <th scope = "col">Description</th>
                                <th scope = "col">Deadline</th>
                                <th scope = "col">Capacity</th>
                            </tr>
                            <tr>
                                <td>${courseInfo.semester}</td>
                                <td>${courseInfo.courseDescription}</td>
                                <td>${deadline}</td>
                                <td>${courseInfo.studentsEnrolled.length}/${courseInfo.courseCapacity}</td>
                            </tr>
                        </table>
                    </form>`
                }

                res.redirect('/studentcourses');
            }
        });
    } else if(subject == null && courseNumber == null){
        
        findAllCourses(function(err, course) {

            studentClassesEnroll = "";
            
            for(let courseInfo of course){

                let month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

                let deadline = month[(courseInfo.enrollmentDeadline.getMonth())] + " " + courseInfo.enrollmentDeadline.getDate() + " " + courseInfo.enrollmentDeadline.getFullYear();
                
                studentClassesEnroll += 
                    `<form method="post" action="/addClass">
                        <table class = "bigTable tableSpace" id="studentCourseTable">
                            <tr>
                                <th scope = "col">Course ID</th>
                                <th scope = "col">Course Name</th>
                                <th scope = "col">Course Time</th>
                                <th scope = "col">Professor</th>
                                <th scope = "col">Select</th>
                            </tr>
                            <tr>
                                <td><input type="hidden" name="classID" value="${courseInfo.courseID}">${courseInfo.courseID}</td>
                                <td>${courseInfo.courseNumberName}</td>
                                <td>${courseInfo.courseDays} ${courseInfo.courseTime}</td>
                                <td>${courseInfo.courseProfessor}</td>
                                <td rowspan="3"><button class = "addCourseButton">Add Course</button></td>
                            </tr>
                            <tr>
                                <th scope = "col">Semester</th>
                                <th scope = "col">Description</th>
                                <th scope = "col">Deadline</th>
                                <th scope = "col">Capacity</th>
                            </tr>
                            <tr>
                                <td>${courseInfo.semester}</td>
                                <td>${courseInfo.courseDescription}</td>
                                <td>${deadline}</td>
                                <td>${courseInfo.studentsEnrolled.length}/${courseInfo.courseCapacity}</td>
                            </tr>
                        </table>
                    </form>`
            }
            res.redirect('/studentcourses');
        });
    }
});

const findStudentByID = require("./database.js").findStudentByID;
const addCourseToStudent = require("./database.js").addCourseToStudent;
const addStudentToCourse = require("./database.js").addStudentToCourse;
const checkForClassTimeConflicts = require("./helperfunctions").checkForClassTimeConflicts;
app.post('/addClass', function(req, res) {

    var classToAddID = req.body.classID;
    var classToAddNameAndNumber = "";
    var classToAddDays = "";
    var classToAddTime = "";
    var classToAddProfessor = "";
    var classToAddSemester = "";

    var studentEmail = "";

    findCourseInformation(classToAddID, function(err, course) {

        classToAddNameAndNumber = course[0].courseNumberName;
        classToAddDays = course[0].courseDays 
        classToAddTime = course[0].courseTime;
        classToAddProfessor = course[0].courseProfessor;
        classToAddSemester = course[0].semester;

        var courseToAddInfo = course[0];

        findStudentByID(id, function(err, student) {
            
            studentEmail = student[0].email;
            let studentCourses = student[0].coursesEnrolled;

            if(studentCourses.length == 0) {
                
                if(courseToAddInfo.studentsEnrolled.length >= courseToAddInfo.courseCapacity){
                    res.render("studentcourses", {coursemessage: '<h2 class="invalid"> Course is full! </h2>', possiblecourses: studentClassesEnroll});
                    return;
                }

                if(currentDate > courseToAddInfo.enrollmentDeadline){
                    res.render("studentcourses", {coursemessage: '<h2 class="invalid"> Course is pass deadline! </h2>', possiblecourses: studentClassesEnroll});
                    return;
                }
                
                addCourseToStudent(id, classToAddID, classToAddSemester, classToAddNameAndNumber, classToAddDays, classToAddTime, classToAddProfessor);
                addStudentToCourse(classToAddID, fullName, studentEmail);
                studentClassesEnrolledIn += `<tr><td>${classToAddID}</td><td>${classToAddSemester}</td><td>${classToAddNameAndNumber}</td><td>${classToAddDays} ${classToAddTime}</td><td>${classToAddProfessor}`
                res.redirect('/studenthome_successfulAdd');

            } else {
                
                var noConflict = true;
                var currentDate = new Date();

                for(let studentCourse of studentCourses){

                    if(studentCourse.courseID == courseToAddInfo.courseID){
                        res.render("studentcourses", {coursemessage: '<h2 class="invalid"> You already added this course! </h2>', possiblecourses: studentClassesEnroll});
                        return;
                    }

                    if(studentCourse.semester == courseToAddInfo.semester && studentCourse.courseNumberName == courseToAddInfo.courseNumberName){
                        res.render("studentcourses", {coursemessage: '<h2 class="invalid"> You cannot add the same course twice! </h2>', possiblecourses: studentClassesEnroll});
                        return;
                    }
                    
                    if(courseToAddInfo.studentsEnrolled.length >= courseToAddInfo.courseCapacity){
                        res.render("studentcourses", {coursemessage: '<h2 class="invalid"> Course is full! </h2>', possiblecourses: studentClassesEnroll});
                        return;
                    }

                    if(currentDate > courseToAddInfo.enrollmentDeadline){
                        res.render("studentcourses", {coursemessage: '<h2 class="invalid"> Course is pass deadline! </h2>', possiblecourses: studentClassesEnroll});
                        return;
                    }
                    
                    if(studentCourse.courseSemester == courseToAddInfo.semester && !checkForClassTimeConflicts(studentCourse, courseToAddInfo)) {
                            noConflict = false;
                    }
                }

                if(noConflict) {
                    addCourseToStudent(id, classToAddID, classToAddSemester, classToAddNameAndNumber, classToAddDays, classToAddTime, classToAddProfessor);
                    addStudentToCourse(classToAddID, fullName, studentEmail);
                    studentClassesEnrolledIn += `<tr><td>${classToAddID}</td><td>${classToAddSemester}</td><td>${classToAddNameAndNumber}</td><td>${classToAddDays} ${classToAddTime}</td><td>${classToAddProfessor}`
                    res.redirect('/studenthome_successfulAdd');
                } else if(!noConflict){
                    res.render("studentcourses", {coursemessage: '<h2 class="invalid"> There is a time conflict with one of your added courses! </h2>', possiblecourses: studentClassesEnroll});
                }
            }
        });
    });
});

const findAllStudents = require('./database.js').findAllStudents;
const findAllInstructors = require('./database.js').findAllInstructors;
const findAllSearches = require('./database.js').findAllSearches;
app.post('/showdatabase', function(req, res) {

    if(req.body.adminButton == 1) {

        adminTable = "";

        adminTable +=  
        `<table class = "bigTable" id="adminTable">
        <tr>
            <th scope = "col">Student ID</th>
            <th scope = "col">Student Name</th>
            <th scope = "col">Courses Enrolled</th>
        </tr>`

        findAllStudents(function(err, students) {
            for(let student of students){
                adminTable += `<tr><td>${student._id}</td><td>${student.firstName} ${student.lastName}</td><td>`
                for(let course of student.coursesEnrolled){
                    adminTable += course.courseID + " ";
                }
                adminTable += `</td></tr>`
            }

            res.render('adminhome', {adminTableInfo: adminTable});
        })
        
    } else if (req.body.adminButton == 2) {
        
        adminTable = "";

        adminTable +=  
        `<table class = "bigTable" id="adminTable">
        <tr>
            <th scope = "col">Instructor ID</th>
            <th scope = "col">Instructor Name</th>
            <th scope = "col">Courses Teaching</th>
        </tr>`

        findAllInstructors(function(err, instructors) {
            for(let instructor of instructors){
                adminTable += `<tr><td>${instructor._id}</td><td>${instructor.firstName} ${instructor.lastName}</td><td>`
                for(let course of instructor.coursesTeaching){
                    adminTable += course.courseID + " ";
                }
                adminTable += `</td></tr>`
            }

            res.render('adminhome', {adminTableInfo: adminTable});
        })

    } else if (req.body.adminButton == 3) {
        
        adminTable = "";

        findAllCourses(function(err, courses) {
            
            for(let course of courses){
                
                adminTable += 
                `<table class = "bigTable tableSpace" id="adminTable">
                    <tr>
                        <th scope = "col">Course ID</th>
                        <th scope = "col">Semester</th>
                        <th scope = "col">Course Name</th>
                        <th scope = "col">Days/Time</th>
                        <th scope = "col">Professor</th>
                    </tr>`
                
                adminTable += 
                `<tr>
                    <td>${course.courseID}</td>
                    <td>${course.semester}</td>
                    <td>${course.courseNumberName}</td>
                    <td>${course.courseDays} ${course.courseTime}</td>
                    <td>${course.courseProfessor}</td>
                </tr>
                <tr>
                <th scope = "col" colspan="5">Students Enrolled</th>
                </tr><tr><td colspan="5">`
                for(let student of course.studentsEnrolled){
                    adminTable += student.studentName + " ";
                }
                adminTable += `</td></tr>`
            }

            res.render('adminhome', {adminTableInfo: adminTable});
        });

    } else if(req.body.adminButton == 4) {

        adminTable = "";

        findAllSearches(function(err, searches) {
            
            for(let search of searches){
                
                adminTable += 
                `<table class = "bigTable tableSpace" id="adminTable">
                    <tr>
                        <th scope = "col">Student ID</th>
                        <th scope = "col">Student Name</th>
                        <th scope = "col">Searches</th>
                    </tr>`
                
                adminTable += 
                `<tr>
                    <td>${search.studentID}</td>
                    <td>${search.studentFullName}</td>
                    <td>`
                    for(let searchWords of search.studentSearch){
                        adminTable += searchWords + " ";
                    }
                adminTable += `</td></tr>`
            }

            res.render('adminhome', {adminTableInfo: adminTable});
        });

    }
});