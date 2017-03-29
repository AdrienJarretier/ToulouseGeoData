const sqlite3 = require('sqlite3').verbose();
const express = require('express');
var app = express();

const config = { port: 9226 };

app.use(express.static(__dirname + '/../client'));


app.get('/', function(req, res) {
    res.sendfile('index.html');
});

app.get('/patinoires', function(req, res) {

    var db = new sqlite3.Database('firstTestDb.db');

    db.serialize(function() {

        db.all("SELECT * FROM patinoires", function(err, rows) {
            console.log(rows);
        });

    });

    db.close();
});

app.listen(config.port, function() {
    console.log('listening on *:' + config.port);
});
