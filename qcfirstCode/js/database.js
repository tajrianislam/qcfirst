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
});

const instructorSchema = new Schema ({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: mongoose.SchemaTypes.Email, required: true, unique: true},
    password: {type: String, required: true},
    coursesTeaching: [{courseNumberName: {type: String},
                       courseDaysTime: {type:String} 
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


exports.StudentModel = Student;
exports.InstructorModel = Instructor;
exports.createAndSaveStudent = createAndSaveStudent;
exports.createAndSaveInstructor = createAndSaveInstructor;
exports.findStudentLogin = findStudentLogin;
exports.findInstructorLogin = findInstructorLogin;

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
    studentsEnrolled: [String]
});

const Course = mongoose.model("Course", courseSchema);

const createAndSaveCourse = (sem, dept, numberName, days, time, professor, capacity, description, done) => {

    let randomValue = createRandomCourseID();

    var course = new Course({courseID: randomValue, semester: sem, courseDept: dept, courseNumberName: numberName, courseDays: days, courseTime: time, courseProfessor: professor, courseCapacity: capacity, courseDescription: description});

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

const addCourseToInstructor = (instructorID, numberName, daysTime) => {
    
    Instructor.findByIdAndUpdate(instructorID, {$push: {"coursesTeaching": {courseNumberName: numberName, courseDaysTime: daysTime}}}, {safe: true, upsert: true, new : true}, (err, instructor) => {
        if (err) return console.error(err);
    });
}

exports.CourseModel = Course;
exports.createAndSaveCourse = createAndSaveCourse;
exports.addCourseToInstructor = addCourseToInstructor;