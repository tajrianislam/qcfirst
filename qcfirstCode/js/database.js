const mongoose = require ('mongoose');
require('mongoose-type-email');

mongoose.connect('', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false }, function(err) {
    if (err) throw err;
});

const Schema = mongoose.Schema;

const studentSchema = new Schema ({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: mongoose.SchemaTypes.Email, required: true, unique: true},
    password: {type: String, required: true},
    coursesEnrolled: [{courseID: {type: Number},
                       courseSemester: {type: String},
                       courseNumberName: {type: String},
                       courseDays: {type: String},
                       courseTime: {type: String},
                       courseProfessor: {type: String}
                     }]
});

const instructorSchema = new Schema ({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: mongoose.SchemaTypes.Email, required: true, unique: true},
    password: {type: String, required: true},
    coursesTeaching: [{courseID: {type: Number},
                       courseSemester: {type: String},
                       courseNumberName: {type: String},
                       courseDays: {type: String}, 
                       courseTime: {type: String}
                     }]
});

const adminSchema = new Schema ({
    email: {type: mongoose.SchemaTypes.Email, required: true, unique: true},
    password: {type: String, required: true},
});

const Student = mongoose.model("Student", studentSchema);
const Instructor = mongoose.model("Instructor", instructorSchema);
const Admin = mongoose.model("Admin", adminSchema);

const createAndSaveStudent = (fName, lName, emailAddress, pass, done) => {

    var student = new Student({firstName: fName, lastName: lName, email: emailAddress, password: pass});

    student.save(function(err, data) {
        if (err) console.error(err);
        
        done(null, data)
    });
}

const createAndSaveInstructor = (fName, lName, emailAddress, pass, done) => {

    var instructor = new Instructor({firstName: fName, lastName: lName, email: emailAddress, password: pass});

    instructor.save(function(err, data) {
        if (err) console.error(err);
        
        done(null, data);
    });
}

const findStudentLogin = (emailAddress, pass, done) => {

    Student.find({email: emailAddress, password: pass}, function(err, student) {
        if (err) return console.error(err);

        done(null, student);
    });

}

const findInstructorLogin = (emailAddress, pass, done) => {
    
    Instructor.find({email: emailAddress, password: pass}, function(err, instructor) {
        if (err) return console.error(err);

        done(null, instructor);
    });
}

const findAdminLogin = (emailAddress, pass, done) => {
    
    Admin.find({email: emailAddress, password: pass}, function(err, admin) {
        if (err) return console.error(err);

        done(null, admin);
    });
}

const findStudentByID = (studentID, done) => {

    Student.find({_id: studentID}, function(err, student) {
        if (err) return console.error(err);

        done(null, student);
    });
}

const findInstructorByID = (instructorID, done) => {

    Instructor.find({_id: instructorID}, function(err, instructor) {
        if (err) return console.error(err);

        done(null, instructor);
    });
}

const findAllInstructors = (done) => {
    
    Instructor.find({}, function(err, instructors) {
        if (err) return console.error(err);

        done(null, instructors);
    });
}

const findAllStudents = (done) => {
    
    Student.find({}, function(err, students) {
        if (err) return console.error(err);

        done(null, students);
    });
}

exports.StudentModel = Student;
exports.InstructorModel = Instructor;
exports.createAndSaveStudent = createAndSaveStudent;
exports.createAndSaveInstructor = createAndSaveInstructor;
exports.findStudentLogin = findStudentLogin;
exports.findInstructorLogin = findInstructorLogin;
exports.findAdminLogin = findAdminLogin;
exports.findStudentByID = findStudentByID;
exports.findInstructorByID = findInstructorByID;
exports.findAllInstructors = findAllInstructors;
exports.findAllStudents = findAllStudents;


// Course Schema and Functions


const courseSchema = new Schema ({
    courseID: {type: Number, required: true, unique: true},
    semester: {type: String, required: true},
    courseDept: {type: String, required: true},
    courseNumberName: {type: String, required: true},
    courseDays: {type: String, required: true},
    courseTime: {type: String, required: true},
    courseProfessor: {type: String, required: true},
    courseCapacity: {type: Number, required: true},
    courseDescription: {type: String, required: true},
    enrollmentDeadline: {type: Date, required: true},
    studentsEnrolled: [{studentName: {type: String},
                        studentEmail: {type: String} 
                      }]
});

const Course = mongoose.model("Course", courseSchema);

const createAndSaveCourse = (sem, dept, numberName, days, time, professor, capacity, description, done) => {

    let randomValue = createRandomCourseID();
    let deadline = new Date();

    if(sem == "Summer 2021"){
        deadline = new Date(2021, 5, 20);
    } else if(sem == "Fall 2021") {
        deadline = new Date(2021, 7, 25);
    } else if(sem == "Winter 2022") {
        deadline = new Date(2021, 11, 27);
    } else if(sem == "Spring 2022") {
        deadline = new Date(2022, 0, 25);
    } else if(sem == "Summer 2022") {
        deadline = new Date(2022, 5, 20);
    } 

    var course = new Course({courseID: randomValue, semester: sem, courseDept: dept, courseNumberName: numberName, courseDays: days, courseTime: time, courseProfessor: professor, courseCapacity: capacity, courseDescription: description, enrollmentDeadline: deadline});

    course.save(function(err, data) {
        if (err) console.error(err);
        
        done(null, data);
    });
}

const createRandomCourseID = () => {
    var randomValue = Math.floor(Math.random()*90000) + 10000;

    Course.exists({courseID: randomValue}, function (err, doc) {
        if(doc) {
            return createRandomCourseID();
        } else {
            return randomValue;
        }
    });

    return randomValue;
};

const addCourseToInstructor = (instructorID, cID, semester, numberName, days, time) => {
    
    Instructor.findByIdAndUpdate(instructorID, {$push: {"coursesTeaching": {courseID: cID, courseSemester: semester, courseNumberName: numberName, courseDays: days, courseTime: time}}}, {safe: true, upsert: true, new : true}, (err, instructor) => {
        if (err) return console.error(err);
    });
}

const addCourseToStudent = (studentID, cID, semester, numberName, days, time, professor) => {
    
    Student.findByIdAndUpdate(studentID, {$push: {"coursesEnrolled": {courseID: cID, courseSemester: semester, courseNumberName: numberName, courseDays: days, courseTime: time, courseProfessor: professor}}}, {safe: true, upsert: true, new : true}, (err, student) => {
        if (err) return console.error(err);
    });
}

const addStudentToCourse = (cID, name, email) => {
    
    Course.findOneAndUpdate({courseID: cID}, {$push: {"studentsEnrolled": {studentName: name, studentEmail: email}}}, {safe: true, upsert: true, new : true}, (err, student) => {
        if (err) return console.error(err);
    });
}

const findCourseInformation = (cID, done) => {

    Course.find({courseID: cID}, function(err, course) {
        if (err) return console.error(err);

        done(null, course);
    });
}

const findClassWithSearch = (searchTerm, done) => {

    Course.find({courseNumberName: {$regex: searchTerm}}, function(err, courses) {
        if (err) return console.error(err);

        done(null, courses);
    });
}

const findClassForEnrollWithID = (cID, done) => {

    Course.find({courseID: cID}, function(err, course) {
        if (err) return console.error(err);

        done(null, course);
    });
}

const findClassForEnrollWithSubjectAndNumber = (subject, cNumber, done) => {

    Course.find({courseDept: subject, courseNumberName: cNumber}, function(err, course) {
        if (err) return console.error(err);

        done(null, course);
    });
}

const findAllCourses = (done) => {
    
    Course.find({}, function(err, courses) {
        if (err) return console.error(err);

        done(null, courses);
    });
}

const deleteCourseFromInstructor = (instructorID, cID, done) => {

    Instructor.findByIdAndUpdate({_id: instructorID}, {$pull: {"coursesTeaching": {courseID: cID}}}, {safe: true, upsert: true, new : true}, (err, data) => {
        if (err) return console.error(err);
    });

    findCourseInformation(cID, function(err, course) {

        if(course[0].studentsEnrolled.length > 0) deleteCourseFromStudent(cID);

        deleteCourseFromDatabase(cID);
    });

    Instructor.findById(instructorID, function(err, instructor) {
        if (err) return console.error(err);

        done(null, instructor);
    });
}

const deleteCourseFromDatabase = (cID) => {
    
    Course.deleteOne({courseID: cID}, (err, data) => {
        if (err) return console.error(err);
    });
}

const deleteCourseFromStudent = (cID) => {

    Student.updateMany({"coursesEnrolled.courseID": cID}, {$pull: {"coursesEnrolled": {courseID: cID}}}, {safe: true, upsert: true, new : true, mutli: true}, (err, data) => {
        if (err) return console.error(err);
    });
}

exports.CourseModel = Course;
exports.createAndSaveCourse = createAndSaveCourse;
exports.addCourseToInstructor = addCourseToInstructor;
exports.addCourseToStudent = addCourseToStudent;
exports.addStudentToCourse = addStudentToCourse;
exports.findCourseInformation = findCourseInformation;
exports.findClassWithSearch = findClassWithSearch;
exports.findClassForEnrollWithID = findClassForEnrollWithID;
exports.findClassForEnrollWithSubjectAndNumber = findClassForEnrollWithSubjectAndNumber;
exports.findAllCourses = findAllCourses;
exports.deleteCourseFromInstructor = deleteCourseFromInstructor;


// Search Schema and Functions


const searchSchema = new Schema ({
    studentID: {type: String},
    studentFullName: {type: String},
    studentSearch: [String]
});

const Search = mongoose.model("Search", searchSchema);

const createAndSaveSearchForStudent = (stuID, stuName, searchInfo, done) => {

    var searchStudent = new Search({studentID: stuID, studentFullName: stuName, studentSearch: [searchInfo]});

    searchStudent.save(function(err, data) {
        if (err) console.error(err);
        
        done(null, data);
    });
}

const findStudentSearch = (stuID, done) => {

    Search.find({studentID: stuID}, function(err, searchStudent) {
        if (err) return console.error(err);

        done(null, searchStudent);
    });
}

const addSearchTermToStudent = (stuID, term) => {

    Search.findOneAndUpdate({studentID: stuID}, {$push: {studentSearch: term}}, {safe: true, upsert: true, new : true}, (err, student) => {
        if (err) return console.error(err);
    });

}

const findAllSearches = (done) => {
    
    Search.find({}, function(err, searches) {
        if (err) return console.error(err);

        done(null, searches);
    });
}

exports.createAndSaveSearchForStudent = createAndSaveSearchForStudent;
exports.addSearchTermToStudent = addSearchTermToStudent;
exports.findStudentSearch = findStudentSearch;
exports.findAllSearches = findAllSearches;