class PatinoireFeature {
  constructor(patinoireRow) {

    this.type = 'Feature';
    this.geometry = {
      type: 'Point',
      coordinates: [patinoireRow.lng, patinoireRow.lat]
    };
    this.properties = {
      nom_complet: patinoireRow.nom_complet,
      adresse: patinoireRow.adresse,
      telephone: patinoireRow.telephone
    };

    this.id = patinoireRow.id;
  }

  get coordinates() {
    return this.geometry.coordinates;
  }
}

// exporte la definition de la classe
// nodejs peut alors charger ce fichier comme un module qui construit PatinoireFeature
module.exports = PatinoireFeature;
