# WebMapGeoData

## Server

requirement versions :
- nodejs : v 6.10.0 (lts)
- npm : v 4.4.1

Do this only once
```bash
cd server
npm install
node fillDb.js
```

configuration can be found in `config.json`

Then everytime you want to launch the server
```bash
node .
```

you can now open you navigator to http://127.0.0.1:9226/ (if you didn't change the port in config.json)

## Libs

- Jquery
- Leaflet : map
  - awesome-markers : custom markers with **ionicons**
- Nodejs
  - csv-parse : csv parser
  - express : web framework
  - sqlite3 : sqLite database

## Data

The data used come from data.toulouse-metropole.fr

## Authors

- Houseaux laurie
- Jarretier Adrien
