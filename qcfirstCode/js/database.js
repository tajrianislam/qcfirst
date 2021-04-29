const mongoose = require ('mongoose');

mongoose.connect('mongodb+srv://User1:passwrd1234@cluster0.vkrtm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

const Scehma = mongoose.Schema;

const studentSchema = new Schema ({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
});

const instructorSchema = new Schema ({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
});

const Student = mongoose.model("Student", studentSchema);
const Instructor = mongoose.model("Instructor", instructorSchema);


const createAndSaveStudent = (done, fName, lName, emailAddress, pass) => {
    var student = new Student({firstName: fName, lastName: lName, email: emailAddress, password: pass});

    student.save(function(err, data) {
        if (err) 
            return console.error(err);
        
        done(null, data)
    });
}

const createAndSaveInstructor = (done, fName, lName, emailAddress, pass) => {
    var instructor = new Instructor({firstName: fName, lastName: lName, email: emailAddress, password: pass});

    instructor.save(function(err, data) {
        if (err) 
            return console.error(err);
        
        done(null, data)
    });
}

const findUserLogin = (done, emailAddress, pass) => {
    
    Student.count({email: emailAddress, password: pass}, function (err, count){ 
        if(count > 0){
            Student.find({email: emailAddress, password: pass}, (error, student) => {
                document.querySelector("#studentName").innerHTML = student.firstName + " " + student.lastName;
                document.querySelector("#studentID").innerHTML = student._id;
                done(null, data)
              });
        }
    });
    
    Instructor.count({email: emailAddress, password: pass}, function (err, count){ 
        if(count > 0){
            Student.find({email: emailAddress, password: pass}, (error, student) => {
                document.querySelector("#instructorName").innerHTML = student.firstName + " " + student.lastName;
                document.querySelector("#instructorID").innerHTML = student._id;
                done(null, data)
              });
        }
    }); 
    
    document.querySelector("#invalid").innerHTML = "Login Failed";
    done(null, data);
}

exports.StudentModel = Student;
exports.InstructorModel = Instructor;
exports.createAndSaveStudent = createAndSaveStudent;
exports.createAndSaveInstructor = createAndSaveInstructor;
exports.findUserLogin = findUserLogin;