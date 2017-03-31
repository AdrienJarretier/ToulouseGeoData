const sqlite3 = require('sqlite3').verbose();

const parse = require('csv-parse/lib/sync');

const fs = require('fs');

var db = new sqlite3.Database('firstTestDb.db');

db.serialize(function() {

    db.run("CREATE TABLE IF NOT EXISTS patinoires (id INTEGER PRIMARY KEY, type TEXT, long REAL, lat REAL, nom_complet TEXT, adresse TEXT, telephone TEXT)");

    const csvFile = fs.openSync('patinoires.csv', 'r');

    const csvContent = fs.readFileSync(csvFile);

    fs.closeSync(csvFile);

    var dataArray = parse(csvContent, { delimiter: ";" });

    // console.log(dataArray);

    var stmt = db.prepare("INSERT INTO patinoires VALUES (?, ?, ?, ?, ?, ?, ?)");

    for (var i = 1; i < dataArray.length; ++i) {

        var geoShape = JSON.parse(dataArray[i][1]);
        stmt.run( i, geoShape.type, geoShape.coordinates[0], geoShape.coordinates[1], dataArray[i][2], dataArray[i][3], dataArray[i][4] );

    }
    stmt.finalize();

    db.all("SELECT * FROM patinoires", function(err, rows) {
        console.log(rows);
    });

});

db.close();