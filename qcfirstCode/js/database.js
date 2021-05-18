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
                       courseDaysTime: {type: String} 
                     }]
});

const Student = mongoose.model("Student", studentSchema);
const Instructor = mongoose.model("Instructor", instructorSchema);

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

const findStudentByID = (studentID, done) => {

    Student.find({_id: studentID}, function(err, student) {
        if (err) return console.error(err);

        done(null, student);
    });
}


exports.StudentModel = Student;
exports.InstructorModel = Instructor;
exports.createAndSaveStudent = createAndSaveStudent;
exports.createAndSaveInstructor = createAndSaveInstructor;
exports.findStudentLogin = findStudentLogin;
exports.findInstructorLogin = findInstructorLogin;
exports.findStudentByID = findStudentByID;


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

const addCourseToInstructor = (instructorID, cID, semester, numberName, daysTime) => {
    
    Instructor.findByIdAndUpdate(instructorID, {$push: {"coursesTeaching": {courseID: cID, courseSemester: semester, courseNumberName: numberName, courseDaysTime: daysTime}}}, {safe: true, upsert: true, new : true}, (err, instructor) => {
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



exports.CourseModel = Course;
exports.createAndSaveCourse = createAndSaveCourse;
exports.addCourseToInstructor = addCourseToInstructor;
exports.addCourseToStudent = addCourseToStudent;
exports.addStudentToCourse = addStudentToCourse;
exports.findCourseInformation = findCourseInformation;
exports.findClassForEnrollWithID = findClassForEnrollWithID;
exports.findClassForEnrollWithSubjectAndNumber = findClassForEnrollWithSubjectAndNumber;