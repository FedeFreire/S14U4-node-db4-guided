const db = require('../data/db-config.js')

function validateAnimal(req, res, next) {
    const { species_id, animal_name } = req.body;
    if (!species_id || typeof species_id !== 'number' || !animal_name || typeof animal_name !== 'string') {
      return res.status(400).json({ message: "Please provide a valid species_id and animal_name for the animal" });
    }
    next();
  }
  
  function validateSpeciesId(req, res, next) {
    const { species_id } = req.params;
    if (!species_id || typeof parseInt(species_id) !== 'number') {
      return res.status(400).json({ message: "Invalid species_id provided" });
    }
  
    db('species').where({ species_id }).first()
      .then(species => {
        if (!species) {
          return res.status(404).json({ message: `Species with id ${species_id} not found` });
        }
        next();
      })
      .catch(next);
  }
  
  module.exports = {
    validateAnimal,
    validateSpeciesId,
  };