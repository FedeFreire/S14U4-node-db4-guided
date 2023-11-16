const db = require('../data/db-config.js');

function getSpecies() {
  return db('species');
}

function getAnimals() { // INCLUDING SPECIES NAME
  return db('animals as a')
    .leftJoin('species as s', 's.species_id', 'a.species_id')
    .select('a.animal_id', 'a.animal_name', 's.species_name');
}

async function createAnimal(animal) {
    return await db.transaction(async trx => {
    const { species_name, ...animalDetails } = animal;
    let species = await trx('species').where({ species_name }).first();

    if (!species) {
      const [species_id] = await trx('species').insert({ species_name });
      species = { species_id, species_name };
    }

    const [animal_id] = await trx('animals').insert({
      ...animalDetails,
      species_id: species.species_id
    });

    return trx('animals as a')
      .join('species as s', 's.species_id', 'a.species_id')
      .select('a.animal_id', 'a.animal_name', 's.species_name')
      .where({ animal_id })
      .first();
  });
}


function deleteSpecies(species_id) {
  return db('species').where({ species_id }).del();
}

module.exports = {
  getSpecies,
  getAnimals,
  createAnimal,
  deleteSpecies,
};
