//const { response } = require('express');
const express = require ('express');
const path = require ('path');
const bodyParser = require ('body-parser');
const app = express();
const router = express.Router();
const port = 3000;

app.use(express.static(path.join(__dirname, '../')));
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../html', 'index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../html', 'index.html'));
});

app.get('/signup.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../html', 'signup.html'));
});

app.get('/instructorcreate.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../html', 'instructorcreate.html'));
});

app.get('/instructorhome.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../html', 'instructorhome.html'));
});

app.get('/instructorroster.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../html', 'instructorroster.html'));
});

app.get('/studentcourses.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../html', 'studentcourses.html'));
});

app.get('/studentenroll.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../html', 'studentenroll.html'));
});

app.get('/studenthome.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../html', 'studenthome.html'));
});

app.listen(port, () => {
    console.log(`Listening on Port:${port}`)
});

app.post('/', function(req, res) {
    //Use findUserLogin function
})

app.post('/login', function(req, res) {
    //Use createAndSave Student or Instructor based off button pressed
    //Then send them back to login to log in
})