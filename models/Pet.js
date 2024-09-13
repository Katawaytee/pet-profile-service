/*{
        petId: 'abc123',
        userID: 'user001',
        petName: 'Buddy',
        gender: 'Male',
        species: 'Golden Retriever',
        age: 5,
        image: ['link1', 'link2'],
        behaviorDescription: 'friendly and energetic',
        vaccinatedComment: 'complete',
        video: ['videoLink1', 'videoLink2']
    }, */

const mongoose = require("mongoose");

const petSchema = new mongoose.Schema({
  // petId: {
  //   type: String,
  //   required: true,
  // },
  userId: {
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
    enum: ["male", "female"],
    require: true,
  },
  age: {
    type: Number,
    require: true,
  },
  image: {
    type: [String],
  },
  behaviorDescription: {
    type: String,
  },
  vaccinatedComment: {
    type: String,
    enum: ["complete", "pending", "never"],
    required: true,
  },
  video: {
    type: [String],
  },
});

module.exports = mongoose.model("Pet", petSchema);
