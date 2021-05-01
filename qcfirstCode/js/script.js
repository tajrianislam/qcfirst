//Have methods that check if signup is valid information

//Have methods that pop up if user is incorrect

function checkSignupFields (firstName, lastName, email, confirmEmail, password, confirmPassword) {

    if(firstName == "" && firstName.length > 15){
        console.log("First name field is empty or too long");
        return false;
    }

    if(lastName == "" && lastName.length > 20){
        console.log("Last name field is empty or too long");
        return false;
    }

    let emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

    if(!emailRegex.test(email)){
        console.log("Invalid email input");
        return false;
    }

    if(email != confirmEmail){
        console.log("Emails do not match");
        return false;
    }

    if(password == ""){
        console.log("Password cannot be empty");
        return false;
    }
    
    if(password != confirmPassword){
        console.log("Passwords do not match")
        return false;
    }

    return true;
}

exports.checkSignupFields = checkSignupFields;