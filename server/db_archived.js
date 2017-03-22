var sqlite3 = require('sqlite3').verbose();

const parse = require('csv-parse');

const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
    input: fs.createReadStream('patinoires.csv')
});

var countLines = 0;

rl.on('line', (line) => {

    if (countLines > 0) {

        parse(line, { delimiter: ";" }, function(err, output) {
            console.log(output);
        });
    }

    ++countLines;
});

rl.on('close', () => {
    console.log("end")
});





var db = new sqlite3.Database('firstTestDb.db');

db.serialize(function() {

    //     db.run("CREATE VIRTUAL TABLE demo_index USING rtree(
    //    id,              -- Integer primary key
    //    minX, maxX,      -- Minimum and maximum X coordinate
    //    minY, maxY       -- Minimum and maximum Y coordinate
    // )");

    db.run("CREATE TABLE IF NOT EXISTS patinoires (id INTEGER, x REAL, y REAL, nom_complet TEXT, adresse TEXT, telephone TEXT)");



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