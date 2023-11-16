const express = require('express');
const helpers = require('./model');
const { validateAnimal, validateSpeciesId } = require('./middleware');

const router = express.Router();

router.get('/species', (req, res, next) => {
  helpers.getSpecies()
    .then(species => {
      res.status(200).json(species);
    })
    .catch(next); // our custom err handling middleware in server.js will trap this
});

router.get('/animals', (req, res, next) => {
  helpers.getAnimals() //INCLUDING SPECIES NAME
    .then(animals => {
      res.status(200).json(animals);
    })
    .catch(next);
});

router.post('/animals', validateAnimal, (req, res, next) => {
  helpers.createAnimal(req.body)
    .then(animal => {
      res.status(201).json(animal);
    })
    .catch(next);
});


router.delete('/species/:species_id', validateSpeciesId, (req, res, next) => {
  helpers.deleteSpecies(req.params.species_id)
    .then(count => {
      if (count > 0) {
        res.status(204).end();
      } else {
        res.status(404).json({ message: 'Species not found' });
      }
    })
    .catch(next);
});

module.exports = router;
