'use strict';
/*
Strict mode makes several changes to normal JavaScript semantics.
First, strict mode eliminates some JavaScript silent errors by changing them to throw errors.
Second, strict mode fixes mistakes that make it difficult for JavaScript engines to perform optimizations:
strict mode code can sometimes be made to run faster than identical code that's not strict mode.
Third, strict mode prohibits some syntax likely to be defined in future versions of ECMAScript.
*/

const bodyParser = require('body-parser');
const common = require('./common.js');
const express = require('express');
const geojsonArea = require('geojson-area');
const sqlite3 = require('sqlite3').verbose();

let app = express();

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded




const config = common.serverConfig;

app.use(express.static(__dirname + '/../client'));


app.get('/', function(req, res) {
  res.sendfile('index.html');
});

app.get('/patinoires', function(req, res) {

  let db = new sqlite3.Database(config.db.database);

  db.all("SELECT * FROM patinoires", function(err, rows) {

    for (let i = 0; i < rows.length; ++i) {
      rows[i].coordinates = [rows[i].lng, rows[i].lat];

      delete rows[i].lng;
      delete rows[i].lat;
    }
    db.close();
    console.log('sending patinoires');
    res.send(rows);
  });

});

app.get('/boulodromes', function(req, res) {

  let db = new sqlite3.Database(config.db.database);

  db.all("SELECT * FROM boulodromes", function(err, rows) {
    console.log(rows[0]);

    for (let i = 0; i < rows.length; ++i) {
      rows[i].coordinates = [rows[i].lng, rows[i].lat];

      delete rows[i].lng;
      delete rows[i].lat;
    }
    db.close();
    console.log('sending boulodromes');
    res.send(rows);
  });

});

app.get('/election', function(req, res) {

  common.readFile('jsonData/election-presidentielle-2017-second-tour-resultats-ville-de-toulouse.geojson')
    .then((fileContent) => {

      let geoJson = JSON.parse(fileContent);

      for (let feat of geoJson.features) {

        let squareMeters = geojsonArea.geometry(feat.geometry);

        feat.properties.squareMeters = squareMeters;

      }

      console.log('sending election');
      res.send(geoJson);
    });

});

app.post('/addBoulodrome', function(req, res) {
  let db = new sqlite3.Database(config.db.database);

  let stmt = db.prepare("INSERT INTO boulodromes(lng, lat, nom, couvert, type_petanque) VALUES (?, ?, ?, ?, ?, ?)");
  let data = req.body;
  stmt.run(data.longitude, data.latitude, data.index, data.couvert, data.type);
  stmt.finalize();

  db.close();
  console.log('received');
  console.log(req.body);

});

app.listen(config.port, function() {
  console.log('listening on *:' + config.port);
});
