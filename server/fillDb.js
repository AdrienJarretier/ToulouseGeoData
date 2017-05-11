'use strict';
/*
Strict mode makes several changes to normal JavaScript semantics.
First, strict mode eliminates some JavaScript silent errors by changing them to throw errors.
Second, strict mode fixes mistakes that make it difficult for JavaScript engines to perform optimizations:
strict mode code can sometimes be made to run faster than identical code that's not strict mode.
Third, strict mode prohibits some syntax likely to be defined in future versions of ECMAScript.
*/

const sqlite3 = require('sqlite3').verbose();

const parse = require('csv-parse/lib/sync');

const fs = require('fs');

const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

let db = new sqlite3.Database(config.db.database);

db.serialize(function() {

  db.run("CREATE TABLE IF NOT EXISTS patinoires (id INTEGER PRIMARY KEY, type TEXT, lng REAL, lat REAL, nom_complet TEXT, adresse TEXT, telephone TEXT)");

  const csvFile = fs.openSync('csvData/patinoires.csv', 'r');

  const csvContent = fs.readFileSync(csvFile);

  fs.closeSync(csvFile);

  let dataArray = parse(csvContent, { delimiter: ";" });

  // console.log(dataArray);

  let stmt = db.prepare("INSERT INTO patinoires VALUES (?, ?, ?, ?, ?, ?, ?)");

  for (let i = 1; i < dataArray.length; ++i) {

    let geoShape = JSON.parse(dataArray[i][1]);
    stmt.run(i, geoShape.type, geoShape.coordinates[0], geoShape.coordinates[1], dataArray[i][2], dataArray[i][3], dataArray[i][4]);

  }
  stmt.finalize();

  db.all("SELECT * FROM patinoires", function(err, rows) {
    console.log(rows);
  });



  /*
  Geo Point;Geo Shape;index;couvert;type_petanque
  43.6236590022, 1.46079600071;"{""type"": ""Point"", ""coordinates"": [1.46079600070844, 43.62365900222877]}";Périole;N;
  */

  db.run("CREATE TABLE IF NOT EXISTS boulodromes (id INTEGER PRIMARY KEY, type TEXT, lng REAL, lat REAL, nom TEXT, couvert TEXT, type_petanque TEXT)");

  const boulodromesCsvFile = fs.openSync('csvData/boulodromes.csv', 'r');

  const boulodromesCsvContent = fs.readFileSync(boulodromesCsvFile);

  fs.closeSync(boulodromesCsvFile);

  let dataArray = parse(boulodromesCsvContent, { delimiter: ";" });

  // console.log(dataArray);

  let stmt = db.prepare("INSERT INTO boulodromes VALUES (?, ?, ?, ?, ?, ?, ?)");

  for (let i = 1; i < dataArray.length; ++i) {

    let geoShape = JSON.parse(dataArray[i][1]);
    stmt.run(i, geoShape.type, geoShape.coordinates[0], geoShape.coordinates[1], dataArray[i][2], dataArray[i][3], dataArray[i][4]);

  }
  stmt.finalize();




});

db.close();
