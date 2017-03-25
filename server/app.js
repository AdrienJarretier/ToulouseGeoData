const sqlite3 = require('sqlite3').verbose();

var db = new sqlite3.Database('firstTestDb.db');

db.serialize(function() {

    db.all("SELECT * FROM patinoires", function(err, rows) {
        console.log(rows);
    });

});

db.close();