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
const FeatureCollection = require('./FeatureCollection.js');
const BoulodromeFeature = require('./BoulodromeFeature.js');
const PatinoireFeature = require('./PatinoireFeature.js');
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

    let patinoires = new FeatureCollection([]);

    for (let row of rows) {
      patinoires.push(new PatinoireFeature(row));
    }

    db.close();

    console.log('sending patinoires');

    res.send(patinoires);

  });

});

app.get('/boulodromes', function(req, res) {

  let db = new sqlite3.Database(config.db.database);

  db.all("SELECT * FROM boulodromes", function(err, rows) {

    let boulodromes = new FeatureCollection([]);

    for (let row of rows) {
      boulodromes.push(new BoulodromeFeature(row));
    }

    db.close();

    console.log('sending boulodromes');

    res.send(boulodromes);

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

  let stmt = db.prepare("INSERT INTO boulodromes(lng, lat, nom, couvert, type_petanque) VALUES (?, ?, ?, ?, ?)");
  let data = req.body;

  stmt.run([data.longitude, data.latitude, data.index, data.couvert, data.type], function(error) {

    stmt.finalize();


    if (!error) {

      let selectTtmt = db.prepare("SELECT * FROM boulodromes WHERE id=?");

      selectTtmt.get(this.lastID, function(err, row) {

        selectTtmt.finalize();

        db.close();

        let boulodromeFeat = new BoulodromeFeature(row);

        res.send(boulodromeFeat);

      });

    } else {
      console.log("error when trying to insert boulodrome : ");
      console.log(error);

      res.send(error);
    }

  });

});

app.listen(config.port, function() {
  console.log('listening on *:' + config.port);
});
