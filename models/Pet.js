const mongoose = require("mongoose");

/* {
        petId: 'ghi012',
        petName: 'Luna',
        gender: 'Female',
        species: 'Bulldog',
        age: 4,
        image: 'link7'
    }, */

const petSchema = new mongoose.Schema({
  petID: {
    type: String,
    required: true,
  },
  petName: {
    type: String,
    required: true,
  },
  species: {
    type: String,
    require: true,
  },
  gender: {
    type: String,
    require: true,
  },
  age: {
    type: Number,
    require: true,
  },
  image: {
    type: String,
  },
});

module.exports = mongoose.model("Pet", petSchema);
