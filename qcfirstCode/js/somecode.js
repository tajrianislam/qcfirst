var CSCIcourses = ["12 : Introduction to Computers and Computation", 
                  "111 : Introduction to Algorithmic Problem-Solving",
                  "120 : Discrete Mathematics for Finance",
                  "211 : Object-Oriented Programming in C++",
                  "212 : Object-Oriented Programming in Java",
                  "220 : Discrete Structures",
                  "240 : Computer Organization and Assembly Language",
                  "313 : Data Structures",
                  "316 : Principles of Programming Languages",
                  "320 : Theory of Computation",
                  "323 : Design and Analysis of Algorithms",
                  "331 : Database Systems",
                  "340 : Operating Systems Principles",
                  "343 : Computer Architecture",
                  "355 : Internet and Web Technologies",
                  "370 : Software Engineering",
                  "381 : Special Topics in Computer Science"];

var MATHcourses = ["115 : College Algebra for Precalculus",
                  "119 : Mathematics for Elementary School Teachers",
                  "120 : Discrete Mathematics for Computer Science",
                  "122 : Precalculus",
                  "131 : Calculus with Applications to the Social Sciences I",
                  "132 : Calculus with Applications to the Social Sciences II",
                  "141 : Calculus/Differentiation",
                  "142 : Calculus/Integration",
                  "143 : Calculus/Infinite Series",
                  "151 : Calculus/Differentiation & Integration",
                  "152 : Calculus/Integration & Infinite Series",
                  "201 : Calculus",
                  "202 : Advanced Calculus",
                  "220 : Discrete Mathematics",
                  "231 : Linear Algebra I",
                  "232 : Linear Algebra II",
                  "241 : Introduction to Probability and Mathematical Statistics",
                  "242 : Methods of Mathematical Statistics"
                  ];

var ENGLcourses = ["110 : College Writing I",
                  "130, 130H : Writing about Literature in English",
                  "151, 151W : Readings in British Literature",
                  "152, 152W : Readings in American Literature", 
                  "153, 153W : Introduction to the Bible",
                  "154, 154W : Readings in Fiction",
                  "155, 155W : Readings in Drama",
                  "156, 156W : Introduction to Shakespeare",
                  "157, 157W : Readings in Global Literatures in English",
                  "161, 161W :Introduction to Narrative",
                  "162, 162W : Literature and Place",
                  "200W. Writing About Writing",
                  "201W. Essay Writing for Special Fields",
                  "202W: Rhetoric and Writing in English Education",
                  "210W. Introduction to Creative Writing",
                  "211W. Introduction to Writing Nonfiction",
                  "241, 241H. The Text in its Historical Moment",
                  "242. Literary History"
                  ];

document.querySelector("#createCourseDepartment").addEventListener("change", function() {
      
      console.log(document.querySelector("#createCourseDepartment").value);
      var dept = document.querySelector("#createCourseDepartment").value;
      var stringBuilder = "";
      if(dept == "CSCI"){
            
            for(let x = 0; x < CSCIcourses.length; x++){
                  stringBuilder += `<option value="${CSCIcourses[x]}">${CSCIcourses[x]}</option>`
            }
            
            document.querySelector("#createCourseNumber").innerHTML = stringBuilder;

      } else if(dept == "MATH"){
            
            for(let x = 0; x < CSCIcourses.length; x++){
                  stringBuilder += `<option value="${MATHcourses[x]}">${MATHcourses[x]}</option>`
            }
            
            document.querySelector("#createCourseNumber").innerHTML = stringBuilder;

      } else if(dept == "ENGL"){
            
            for(let x = 0; x < CSCIcourses.length; x++){
                  stringBuilder += `<option value="${ENGLcourses[x]}">${ENGLcourses[x]}</option>`
            }
            
            document.querySelector("#createCourseNumber").innerHTML = stringBuilder;

      }
});

document.querySelector("#createCourseButton").addEventListener("click", (event) => {
      
      var invalidDiv = document.querySelector("#courseCreateInvalidMessage");
      var invalidMessage = document.querySelector("#courseCreateMessage");
      
      var semester = document.querySelector("#createCourseSemester").value;
      var department = document.querySelector("#createCourseDepartment").value;
      var number = document.querySelector("#createCourseNumber").value;
      var days = document.querySelector("#createCourseDays").value;
      var time = document.querySelector("#createCourseClassTime").value;
      var capacity = document.querySelector("#createCourseCapacity").value;
      var description = document.querySelector("#createCourseDescription").value;

      if(semester == ""){
            event.preventDefault();
            invalidDiv.removeAttribute("hidden");
            invalidMessage.innerHTML = "Semester cannot be empty!";
      } else if(department == ""){
            event.preventDefault();
            invalidDiv.removeAttribute("hidden");
            invalidMessage.innerHTML = "Department cannot be empty!";
      } else if(number == ""){
            event.preventDefault();
            invalidDiv.removeAttribute("hidden");
            invalidMessage.innerHTML = "Course cannot be empty!";
      } else if(days == ""){
            event.preventDefault();
            invalidDiv.removeAttribute("hidden");
            invalidMessage.innerHTML = "Days cannot be empty!";
      } else if(time == ""){
            event.preventDefault();
            invalidDiv.removeAttribute("hidden");
            invalidMessage.innerHTML = "Time cannot be empty!";
      } else if(capacity == ""){
            event.preventDefault();
            invalidDiv.removeAttribute("hidden");
            invalidMessage.innerHTML = "Capacity cannot be empty!";
      } else if(capacity < 1){
            event.preventDefault();
            invalidDiv.removeAttribute("hidden");
            invalidMessage.innerHTML = "Capacity cannot be negative!";
      } else if(description == ""){
            event.preventDefault();
            invalidDiv.removeAttribute("hidden");
            invalidMessage.innerHTML = "Description cannot be empty";
      }
});