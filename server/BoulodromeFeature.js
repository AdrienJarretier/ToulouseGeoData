class BoulodromeFeature {
  constructor(boulodromeRow) {

    this.type = 'Feature';
    this.geometry = {
      type: 'Point',
      coordinates: [boulodromeRow.lng, boulodromeRow.lat]
    };
    this.properties = {
      nom: boulodromeRow.nom,
      couvert: boulodromeRow.couvert,
      type_petanque: boulodromeRow.type_petanque
    };

    this.id = boulodromeRow.id;
  }

  get coordinates() {
    return this.geometry.coordinates;
  }
}

// exporte la definition de la classe
// nodejs peut alors charger ce fichier comme un module qui construit BoulodromeFeature
module.exports = BoulodromeFeature;
