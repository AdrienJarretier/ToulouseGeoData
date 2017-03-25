const sqlite3 = require('sqlite3').verbose();

const parse = require('csv-parse/lib/sync');

const fs = require('fs');

var db = new sqlite3.Database('firstTestDb.db');

db.serialize(function() {

    db.run("CREATE TABLE IF NOT EXISTS patinoires (id INTEGER PRIMARY KEY, geo_point TEXT, nom_complet TEXT, adresse TEXT, telephone TEXT)");

    const csvFile = fs.openSync('patinoires.csv', 'r');

    const csvContent = fs.readFileSync(csvFile);

    fs.closeSync(csvFile);

    var dataArray = parse(csvContent, { delimiter: ";" });

    console.log(dataArray.length);

    var stmt = db.prepare("INSERT INTO patinoires VALUES (?, ?, ?, ?, ?)");

    for (var i = 1; i < dataArray.length; ++i) {

        console.log("--------------------- " + i + " ---------------------");
        console.log("Geo Point : " + dataArray[i][0]);
        console.log("Geo Shape : " + dataArray[i][1]);
        console.log("nom_complet : " + dataArray[i][2]);
        console.log("adresse : " + dataArray[i][3]);
        console.log("telephone : " + dataArray[i][4]);

        stmt.run(i, dataArray[i][0], dataArray[i][2], dataArray[i][3], dataArray[i][4]);
    }
    stmt.finalize();

    db.all("SELECT * FROM patinoires", function(err, rows) {
        console.log(rows);
    });

    // var stmt = db.prepare("INSERT INTO lorem VALUES (?)");
    // for (var i = 0; i < 10; i++) {
    //     stmt.run("Ipsum " + i);
    // }
    // stmt.finalize();

    // db.each("SELECT rowid AS id, info FROM lorem", function(err, row) {
    //     console.log(row.id + ": " + row.info);
    // });
});

db.close();