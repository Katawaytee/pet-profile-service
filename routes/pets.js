const express = require("express");
const {
  createPet,
  getPets,
  getPet,
  getRandomPets,
  updatePet,
  deletePet,
  getMyPets
} = require("../controllers/pets");
const multer  = require('multer')
const upload = multer({storage: multer.memoryStorage()});
const authenticate = require("../middlewares/authenticate")

const router = express.Router();

router.route("/pets").get(getPets).post(upload.array('images', 10), authenticate, createPet);

router.route("/pets/random").get(authenticate, getRandomPets);

router.route("/pets/user").get(authenticate, getMyPets);

router.route("/pets/:id").get(getPet).put(upload.array('images', 10), authenticate, updatePet).delete(authenticate, deletePet);

module.exports = router;
