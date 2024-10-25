const express = require("express");
const {
  createPet,
  getPets,
  getPet,
  getRandomPets,
  updatePet,
  deletePet,
} = require("../controllers/pets");
const multer  = require('multer')
const upload = multer({storage: multer.memoryStorage()});
const authenticate = require("../middlewares/authenticate")

const router = express.Router();

router.route("/pets").post(upload.array('images', 10), authenticate, createPet).get(authenticate, getPets);

router.route("/pets/random").get(getRandomPets);

router.route("/pets/:id").get(getPet).put(upload.array('images', 10), authenticate, updatePet).delete(deletePet);

router.route("/user/:userId/pets").get(getPets);

module.exports = router;
