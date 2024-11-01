// const mongoose = require("mongoose");
import mongoose from "mongoose";

const petSchema = new mongoose.Schema({
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
});

// module.exports = mongoose.model("Pet", petSchema);
export default mongoose.model("Pet", petSchema);
