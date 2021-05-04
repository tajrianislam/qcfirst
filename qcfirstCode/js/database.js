const mongoose = require ('mongoose');
require('mongoose-type-email');

mongoose.connect('', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }, function(err) {
    if (err) throw err;
});

const Schema = mongoose.Schema;

const studentSchema = new Schema ({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
});

const instructorSchema = new Schema ({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: mongoose.SchemaTypes.Email, required: true, unique: true},
    password: {type: String, required: true},
});

const Student = mongoose.model("Student", studentSchema);
const Instructor = mongoose.model("Instructor", instructorSchema);


const createAndSaveStudent = (fName, lName, emailAddress, confirmEmailAddress, pass, confirmPass, done) => {

    if(emailAddress != confirmEmailAddress)
        return console.error("Emails do not match");

    if(pass != confirmPass)
        return console.error("Passwords do not match");
    
    var student = new Student({firstName: fName, lastName: lName, email: emailAddress, password: pass});

    student.save(function(err, data) {
        if (err) 
            return console.error(err);
        
        done(null, data)
    });
}

const createAndSaveInstructor = (fName, lName, emailAddress, confirmEmailAddress, pass, confirmPass, done) => {

    if(emailAddress != confirmEmailAddress)
        return console.error("Emails do not match");

    if(pass != confirmPass)
        return console.error("Passwords do not match");
    
    var instructor = new Instructor({firstName: fName, lastName: lName, email: emailAddress, password: pass});

    instructor.save(function(err, data) {
        if (err) return console.error(err);
        
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