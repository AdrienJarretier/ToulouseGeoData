'use strict';
/*
Strict mode makes several changes to normal JavaScript semantics.
First, strict mode eliminates some JavaScript silent errors by changing them to throw errors.
Second, strict mode fixes mistakes that make it difficult for JavaScript engines to perform optimizations:
strict mode code can sometimes be made to run faster than identical code that's not strict mode.
Third, strict mode prohibits some syntax likely to be defined in future versions of ECMAScript.
*/

const express = require('express');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

let app = express();

const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

app.use(express.static(__dirname + '/../client'));


app.get('/', function(req, res) {
  res.sendfile('index.html');
});

app.get('/patinoires', function(req, res) {

  let db = new sqlite3.Database(config.db.database);

  db.serialize(function() {

    db.all("SELECT * FROM patinoires", function(err, rows) {

      for (let i = 0; i < rows.length; ++i) {
        rows[i].coordinates = [rows[i].lng, rows[i].lat];

        delete rows[i].lng;
        delete rows[i].lat;
      }
      console.log(rows);
      res.send(rows);
    });

  });

  db.close();
});

app.get('/boulodromes', function(req, res) {

  let db = new sqlite3.Database(config.db.database);

  db.serialize(function() {

    db.all("SELECT * FROM boulodromes", function(err, rows) {

      for (let i = 0; i < rows.length; ++i) {
        rows[i].coordinates = [rows[i].lng, rows[i].lat];

        delete rows[i].lng;
        delete rows[i].lat;
      }
      res.send(rows);
    });

  });

  db.close();
});

app.listen(config.port, function() {
  console.log('listening on *:' + config.port);
});
