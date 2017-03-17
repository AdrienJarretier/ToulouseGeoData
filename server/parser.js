var parse = require('csv-parse');

var input = 'Geo Point;Geo Shape;nom_complet;adresse;telephone\n43.6239460599, 1.47872035332;"{""type"": ""Point"", ""coordinates"": [1.478720353320572, 43.623946059897456]}";PATINOIRE ALEX JANY;chemin du Verdon 31500 Toulouse;05 81 91 78 56\n43.5677782425, 1.453293811;"{""type"": ""Point"", ""coordinates"": [1.45329381099674, 43.56777824246614]}";PATINOIRE BELLEVUE;69ter route de Narbonne 31000 TOULOUSE;05 61 52 93 53';
// var input = 'Geo Point;Geo Shape;nom_complet;adresse;telephone';

// var input = '3.6239460599, 1.47872035332;"{""type"": ""Point"", ""coordinates"": [1.478720353320572, 43.623946059897456]}";PATINOIRE ALEX JANY;chemin du Verdon 31500 Toulouse;05 81 91 78 56';

// var input = '3.6239460599, 1.47872035332;{type: Point, coordinates: [1.478720353320572, 43.623946059897456]};PATINOIRE ALEX JANY;chemin du Verdon 31500 Toulouse;05 81 91 78 56';


parse(input, { delimiter: ";" }, function(err, output) {
    console.log(output);
    console.log(err);
});