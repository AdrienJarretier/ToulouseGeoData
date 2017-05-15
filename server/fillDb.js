'use strict';
/*
Strict mode makes several changes to normal JavaScript semantics.
First, strict mode eliminates some JavaScript silent errors by changing them to throw errors.
Second, strict mode fixes mistakes that make it difficult for JavaScript engines to perform optimizations:
strict mode code can sometimes be made to run faster than identical code that's not strict mode.
Third, strict mode prohibits some syntax likely to be defined in future versions of ECMAScript.
*/

const common = require('./common.js');
const parse = require('csv-parse');
const sqlite3 = require('sqlite3').verbose();

function parseCsvFile(csvFile) {

  return new Promise((resolve, reject) => {
    common.readFile(csvFile)
      .then((fileContent) => {

        parse(fileContent, { delimiter: ";" }, function(err, output) {

          resolve(output);
        });


      });
  });

}

const config = common.serverConfig;

let db = new sqlite3.Database(config.db.database);

db.on('trace', (sql) => { console.log(sql); });

Promise.all([fillPatinoires(), fillBoulodromes()]).then(() => {
  db.close();
  console.log('closing db');
});

function fillPatinoires() {

  return parseCsvFile('csvData/patinoires.csv')
    .then((dataArray) => {

      db.serialize(function() {

        db.run("CREATE TABLE IF NOT EXISTS patinoires (id INTEGER PRIMARY KEY, type TEXT, lng REAL, lat REAL, nom_complet TEXT, adresse TEXT, telephone TEXT)");

        let stmt = db.prepare("INSERT INTO patinoires(lng, lat, nom_complet, adresse, telephone) VALUES (?, ?, ?, ?, ?)");

        for (let i = 1; i < dataArray.length; ++i) {

          let geoShape = JSON.parse(dataArray[i][1]);
          stmt.run(geoShape.coordinates[0], geoShape.coordinates[1], dataArray[i][2], dataArray[i][3], dataArray[i][4]);

        }
        stmt.finalize();

      });

      return; // return Promise.resolve

    });

}

function fillBoulodromes() {

  return parseCsvFile('csvData/boulodromes.csv')
    .then((dataArray) => {

      db.serialize(function() {

        db.run("CREATE TABLE IF NOT EXISTS boulodromes (id INTEGER PRIMARY KEY, lng REAL, lat REAL, nom TEXT, couvert TEXT, type_petanque TEXT)");

        let stmt = db.prepare("INSERT INTO boulodromes(lng, lat, nom, couvert, type_petanque) VALUES (?, ?, ?, ?, ?)");

        for (let i = 1; i < dataArray.length; ++i) {

          let geoShape = JSON.parse(dataArray[i][1]);
          stmt.run(geoShape.coordinates[0], geoShape.coordinates[1], dataArray[i][2], dataArray[i][3], dataArray[i][4]);

        }
        stmt.finalize();

      });

      return; // return Promise.resolve

    });

}

/*
Geo Point;Geo Shape;index;couvert;type_petanque
43.6236590022, 1.46079600071;"{""type"": ""Point"", ""coordinates"": [1.46079600070844, 43.62365900222877]}";Périole;N;
*/
