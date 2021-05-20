// Returns true if there is no conflict, false if there is a conflict
function checkForClassTimeConflicts(studentClass, courseToAdd) {

    var studentCurrentClassDays = studentClass.courseDays;
    var studentCurrentClassTime = studentClass.courseTime;
    
    var courseToAddDays = courseToAdd.courseDays;
    var courseToAddTime = courseToAdd.courseTime;

    if(studentCurrentClassDays == "Monday") {

        if(courseToAddDays == "Monday" || courseToAddDays == "Mon/Wed") {
            
            if(checkForTimeConflict(studentCurrentClassTime, courseToAddTime)){
                return true;
            } else {
                return false;
            }

        } else {
            return true;
        }

    } else if(studentCurrentClassDays == "Tuesday") {

        if(courseToAddDays == "Tuesday" || courseToAddDays == "Tues/Thurs") {
            
            if(checkForTimeConflict(studentCurrentClassTime, courseToAddTime)){
                return true;
            } else {
                return false;
            }

        } else {
            return true;
        }

    } else if(studentCurrentClassDays == "Wednesday") {
        
        if(courseToAddDays == "Wednesday" || courseToAddDays == "Mon/Wed") { 
            
            if(checkForTimeConflict(studentCurrentClassTime, courseToAddTime)){
                return true;
            } else {
                return false;
            }

        } else {
            return true;
        }

    } else if(studentCurrentClassDays == "Thursday") {
        
        if(courseToAddDays == "Thursday" || courseToAddDays == "Tues/Thurs") {
            
            if(checkForTimeConflict(studentCurrentClassTime, courseToAddTime)){
                return true;
            } else {
                return false;
            }

        } else {
            return true;
        }
        
    } else if(studentCurrentClassDays == "Friday") {
        
        if(courseToAddDays == "Friday"){
            
            if(checkForTimeConflict(studentCurrentClassTime, courseToAddTime)){
                return true;
            } else {
                return false;
            }

        } else {
            return true;
        }

    } else if(studentCurrentClassDays == "Saturday") {

        if(courseToAddDays == "Saturday") {
            
            if(checkForTimeConflict(studentCurrentClassTime, courseToAddTime)){
                return true;
            } else {
                return false;
            }

        } else {
            return true;
        }
        
    } else if(studentCurrentClassDays == "Sunday") {

        if(courseToAddDays == "Sunday") {
            
            if(checkForTimeConflict(studentCurrentClassTime, courseToAddTime)){
                return true;
            } else {
                return false;
            }

        } else {
            return true;
        }
        
    } else if(studentCurrentClassDays == "Mon/Wed") {

        if(courseToAddDays == "Monday" || courseToAddDays == "Wednesday" || courseToAddDays == "Mon/Wed") {
            
            if(checkForTimeConflict(studentCurrentClassTime, courseToAddTime)){
                return true;
            } else {
                return false;
            }

        } else {
            return true;
        }
        
    } else if(studentCurrentClassDays == "Tues/Thurs") {
        
        if(courseToAddDays == "Tuesday" || courseToAddDays == "Thursday" || courseToAddDays == "Tues/Thurs") {
            
            if(checkForTimeConflict(studentCurrentClassTime, courseToAddTime)){
                return true;
            } else {
                return false;
            }

        } else {
            return true;
        }
    }
}

// Returns true if there is no conflict, false if there is a conflict
function checkForCreateTimeConflicts(instructorClass, courseDays, courseTime) {

    var instructorCurrentClassDays = instructorClass.courseDays;
    var instructorCurrentClassTime = instructorClass.courseTime;
    
    var courseToAddDays = courseDays;
    var courseToAddTime = courseTime;

    if(instructorCurrentClassDays == "Monday") {

        if(courseToAddDays == "Monday" || courseToAddDays == "Mon/Wed") {
            
            if(checkForTimeConflict(instructorCurrentClassTime, courseToAddTime)){
                return true;
            } else {
                return false;
            }

        } else {
            return true;
        }

    } else if(instructorCurrentClassDays == "Tuesday") {

        if(courseToAddDays == "Tuesday" || courseToAddDays == "Tues/Thurs") {
            
            if(checkForTimeConflict(instructorCurrentClassTime, courseToAddTime)){
                return true;
            } else {
                return false;
            }

        } else {
            return true;
        }

    } else if(instructorCurrentClassDays == "Wednesday") {
        
        if(courseToAddDays == "Wednesday" || courseToAddDays == "Mon/Wed") { 
            
            if(checkForTimeConflict(instructorCurrentClassTime, courseToAddTime)){
                return true;
            } else {
                return false;
            }

        } else {
            return true;
        }

    } else if(instructorCurrentClassDays == "Thursday") {
        
        if(courseToAddDays == "Thursday" || courseToAddDays == "Tues/Thurs") {
            
            if(checkForTimeConflict(instructorCurrentClassTime, courseToAddTime)){
                return true;
            } else {
                return false;
            }

        } else {
            return true;
        }
        
    } else if(instructorCurrentClassDays == "Friday") {
        
        if(courseToAddDays == "Friday"){
            
            if(checkForTimeConflict(instructorCurrentClassTime, courseToAddTime)){
                return true;
            } else {
                return false;
            }

        } else {
            return true;
        }

    } else if(instructorCurrentClassDays == "Saturday") {

        if(courseToAddDays == "Saturday") {
            
            if(checkForTimeConflict(instructorCurrentClassTime, courseToAddTime)){
                return true;
            } else {
                return false;
            }

        } else {
            return true;
        }
        
    } else if(instructorCurrentClassDays == "Sunday") {

        if(courseToAddDays == "Sunday") {
            
            if(checkForTimeConflict(instructorCurrentClassTime, courseToAddTime)){
                return true;
            } else {
                return false;
            }

        } else {
            return true;
        }
        
    } else if(instructorCurrentClassDays == "Mon/Wed") {

        if(courseToAddDays == "Monday" || courseToAddDays == "Wednesday" || courseToAddDays == "Mon/Wed") {
            
            if(checkForTimeConflict(instructorCurrentClassTime, courseToAddTime)){
                return true;
            } else {
                return false;
            }

        } else {
            return true;
        }
        
    } else if(instructorCurrentClassDays == "Tues/Thurs") {
        
        if(courseToAddDays == "Tuesday" || courseToAddDays == "Thursday" || courseToAddDays == "Tues/Thurs") {
            
            if(checkForTimeConflict(instructorCurrentClassTime, courseToAddTime)){
                return true;
            } else {
                return false;
            }

        } else {
            return true;
        }
    }
}

// Returns true if there is no conflict, false if there is a conflict
function checkForTimeConflict(currentClassTime, classToAddTime) {

    if(currentClassTime == "7:45AM-9:00AM") {

        if(classToAddTime == "7:45AM-9:00AM" || classToAddTime == "8:00AM-9:15AM" || classToAddTime == "8:00AM-10:50AM" || classToAddTime == "8:30AM-9:45AM") {
            return false;
        } else {
            return true;
        }

    } else if(currentClassTime == "8:00AM-9:15AM") {

        if(classToAddTime == "8:00AM-9:15AM" || classToAddTime == "7:45AM-9:00AM" || classToAddTime == "8:00AM-10:50AM" || classToAddTime == "8:30AM-9:45AM" || classToAddTime == "9:15AM-10:30AM") {
            return false;
        } else {
            return true;
        }

    } else if(currentClassTime == "8:00AM-10:50AM") {
    
        if(classToAddTime == "8:00AM-10:50AM" || classToAddTime == "7:45AM-9:00AM" || classToAddTime == "8:00AM-9:15AM" || classToAddTime == "8:30AM-9:45AM" || classToAddTime == "9:15AM-10:30AM" || classToAddTime == "10:00AM-12:50PM" || classToAddTime == "10:45AM-12:00PM") {
            return false;
        } else {
            return true;
        }

    } else if(currentClassTime == "8:30AM-9:45AM") {

        if(classToAddTime == "8:30AM-9:45AM" || classToAddTime == "7:45AM-9:00AM" || classToAddTime == "8:00AM-9:15AM" || classToAddTime == "8:00AM-10:50AM" || classToAddTime == "9:15AM-10:30AM") {
            return false;
        } else {
            return true;
        }
    
    } else if(currentClassTime == "9:15AM-10:30AM") {

        if(classToAddTime == "9:15AM-10:30AM" || classToAddTime == "8:00AM-10:50AM" || classToAddTime == "8:30AM-9:45AM" || classToAddTime == "10:00AM-12:50PM" || classToAddTime == "10:45AM-12:00PM") {
            return false;
        } else {
            return true;
        }
    
    } else if(currentClassTime == "10:00AM-12:50PM") {

        if(classToAddTime == "10:00AM-12:50PM" || classToAddTime == "8:00AM-10:50AM" || classToAddTime == "9:15AM-10:30AM" || classToAddTime == "10:45AM-12:00PM" || classToAddTime == "12:15PM-1:30PM") {
            return false;
        } else {
            return true;
        }
    
    } else if(currentClassTime == "10:45AM-12:00PM") {

        if(classToAddTime == "10:45AM-12:00PM" || classToAddTime == "8:00AM-10:50AM" || classToAddTime == "10:00AM-12:50PM") {
            return false;
        } else {
            return true;
        }
    
    } else if(currentClassTime == "12:15PM-1:30PM") {

        if(classToAddTime == "12:15PM-1:30PM" || classToAddTime == "10:00AM-12:50PM") {
            return false;
        } else {
            return true;
        }
    
    } else if(currentClassTime == "1:40PM-2:55PM") {

        if(classToAddTime == "1:40PM-2:55PM") {
            return false;
        } else {
            return true;
        }
    
    } else if(currentClassTime == "3:10PM-4:25PM") {

        if(classToAddTime == "3:10PM-4:25PM") {
            return false;
        } else {
            return true;
        }
    
    } else if(currentClassTime == "5:00PM-6:25PM") {

        if(classToAddTime == "5:00PM-6:25PM") {
            return false;
        } else {
            return true;
        }
    
    } else if(currentClassTime == "6:35PM-7:50PM") {

        if(classToAddTime == "6:35PM-7:50PM") {
            return false;
        } else {
            return true;
        }
    
    } else if(currentClassTime == "8:00PM-9:15PM") {

        if(classToAddTime == "8:00PM-9:15PM") {
            return false;
        } else {
            return true;
        }
    }
}

exports.checkForClassTimeConflicts = checkForClassTimeConflicts;
exports.checkForCreateTimeConflicts = checkForCreateTimeConflicts;
exports.checkForTimeConflict = checkForTimeConflict;