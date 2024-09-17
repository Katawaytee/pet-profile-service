const express = require("express");
const {
  createPet,
  getPets,
  getPet,
  getRandomPets,
  updatePet,
  deletePet,
} = require("../controllers/pets");

const router = express.Router();

router.route("/pets").post(createPet).get(getPets);

router.route("/pets/random").get(getRandomPets);

router.route("/pets/:id").get(getPet).put(updatePet).delete(deletePet);

router.route("/user/:userId/pets").get(getPets);

module.exports = router;
