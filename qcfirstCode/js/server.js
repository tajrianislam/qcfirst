const { response } = require('express');
const express = require ('express');
const path = require ('path');
const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, '../qcfirstCode')));

app.get('/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../html', 'index.html'));
});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, '../html', 'signup.html'));
});

  
app.listen(port, () => {
    console.log(`Listening on Port:${port}`)
});

//app.connect()