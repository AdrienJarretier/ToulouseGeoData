var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('firstTestDb.db');

db.serialize(function() {
    db.run("CREATE TABLE IF NOT EXISTS lorem (info TEXT)");

    var stmt = db.prepare("INSERT INTO lorem VALUES (?)");
    for (var i = 0; i < 10; i++) {
        stmt.run("Ipsum " + i);
    }
    stmt.finalize();

    db

    db.all("SELECT * FROM lorem", function(err, rows) {
        console.log(rows);
    });
});

db.close();
