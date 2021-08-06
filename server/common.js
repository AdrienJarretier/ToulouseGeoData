'use strict';
/*
Strict mode makes several changes to normal JavaScript semantics.
First, strict mode eliminates some JavaScript silent errors by changing them to throw errors.
Second, strict mode fixes mistakes that make it difficult for JavaScript engines to perform optimizations:
strict mode code can sometimes be made to run faster than identical code that's not strict mode.
Third, strict mode prohibits some syntax likely to be defined in future versions of ECMAScript.
*/

const fs = require('fs');

const serverConfig = JSON.parse(fs.readFileSync('config.json', 'utf8'));

function readFile(file) {

  return new Promise((resolve, reject) => {

    fs.open(file, 'r', (err, fd) => {
      fs.readFile(fd, 'utf8', (err, fileContent) => {

        fs.closeSync(fd);

        resolve(fileContent);

      });
    });
  });
}

exports.readFile = readFile;
exports.serverConfig = serverConfig;
