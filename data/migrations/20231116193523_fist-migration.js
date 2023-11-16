/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
//  ****RULES FOR TABLES****

// 1 - ARTIFICIAL PRIMARY KEY
    // 1.1 - ALWAYS CALLED ID
    // 1.2 - ALWAYS INTEGER
    // 1.3 - ALWAYS AUTO-INCREMENT
// 2 - REPRESENTS A SUBJECT OR APPOINTMENT
    // 2.1 - SINGULAR
    // 2.2 - NO ACRONYMS
    // 2.3 - NO SPECIAL CHARACTERS
    // 2.4 - NO SPACES
    // 2.5 - NO RESERVED WORDS
// 3 - TABLE NAMES: PLURAL, BE CONSISTENT
// 4 - TABLE NAMES: NO ACRONYMS
// 5 - TABLE NAMES: NO AMBIGUOUS
// 6 - EVERYBODY UNDERSTANDS WHAT IT IS
// 7 - NO SPACES OR SPECIAL CHARACTERS
// 8 - NO RESERVED WORDS

// ***RULES FOR COLUMNS***

// 1 - NO MULTIPART COLUMNS ("john doe")
// 2 - NO MULTIVALUED COLUMNS ("web35, web36")
// 3 - NO CALCULATED / DERIVED VALUES
// 4 - HOLDS A SINGLE VALUE
// 5 - NO email1 email2 ETC COLUMNS
// 6 - COLUMNS CAN'T DEPEND ON EACH OTHER
// 7 - THE PRIMARY KEY REPRESENTS THE RECORD: NO MEANINGLESS PRIMARY KEYS
// 8 - THE NON-PK ARE ATTRIBUTES OF THE RECORD: NO MEANINGLESS COLUMNS


exports.up = async function (knex) {
  await knex.schema
    .createTable("zoos", (table) => {
      table.increments("zoo_id");
      table.string("zoo_name", 128).notNullable();
      table.string("address", 128).notNullable().unique();
    })
    .createTable("species", (table) => {
      table.increments("species_id");
      table.string("species_name", 128).notNullable().unique();
    })
    .createTable("animals", (table) => {
      table.increments("animal_id");
      table.string("animal_name", 128).notNullable();
      table
        .integer("species_id") //Foreign Key (FK)
        .unsigned() //Only positive numbers (no negatives)
        .notNullable() //Cannot be null (required)
        .references("species_id") //References the PK in the species table (the column name)
        .inTable("species") //References the table name
        .onDelete("CASCADE") //What happens if the PK value is deleted, cascade means delete all the FK values
        .onUpdate("CASCADE"); //What happens if the PK value changes, cascade means change all the FK values
    })
    .createTable("zoo_animals", (table) => {
      table.increments("zoo_animal_id");
      table
        .integer("zoo_id")
        .unsigned()
        .notNullable()
        .references("zoo_id")
        .inTable("zoos")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      table
        .integer("animal_id")
        .unsigned()
        .notNullable()
        .references("animal_id")
        .inTable("animals")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
//Always undo in reverse order
exports.down = async function (knex) {
  await knex.schema
    .dropTableIfExists("zoo_animals")
    .dropTableIfExists("animals")
    .dropTableIfExists("species")
    .dropTableIfExists("zoos");
};
