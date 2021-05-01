const mongoose = require ('mongoose');
require('mongoose-type-email');

mongoose.connect('', { useNewUrlParser: true, useUnifiedTopology: true }, function(err) {
    if (err) throw err;
});

const Schema = mongoose.Schema;

const studentSchema = new Schema ({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    home: {type: String},
});

const instructorSchema = new Schema ({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: mongoose.SchemaTypes.Email, required: true},
    password: {type: String, required: true},
});

const Student = mongoose.model("Student", studentSchema);
const Instructor = mongoose.model("Instructor", instructorSchema);


const createAndSaveStudent = (fName, lName, emailAddress, confirmEmailAddress, pass, confirmPass, done) => {

    if(emailAddress != confirmEmailAddress)
        return console.error("Emails do not match");

    if(pass != confirmPass)
        return console.error("Passwords do not match");
    
    var student = new Student({firstName: fName, lastName: lName, email: emailAddress, password: pass, home: "/studenthome"});

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
        if (err) 
            return console.error(err);
        
        done(null, data)
    });
}

const findUserLogin = (emailAddress, pass, done) => {

    //Figure out how to authenticate user
    
    // Student.countDocuments({email: emailAddress, password: pass}, function (err, count){ 
       
    //     if (err) return console.error(err);
        
    //     if(count > 0){
    //         Student.find({email: emailAddress, password: pass}, (error, student) => {

    //             if (err) return console.error(err);
                
    //             console.log("Student login");       
    //             done(null, student);
    //         });
    //     }
    // });

    // Instructor.countDocuments({email: emailAddress, password: pass}, function (err, count){ 
    //     if(count > 0){
    //         Student.find({email: emailAddress, password: pass}, (error, student) => {
    //             return console.log("Login Successful");
    //         });
    //     }
    // }); 
    
    //return console.error("Login Failed");
}


exports.StudentModel = Student;
exports.InstructorModel = Instructor;
exports.createAndSaveStudent = createAndSaveStudent;
exports.createAndSaveInstructor = createAndSaveInstructor;
exports.findUserLogin = findUserLogin;