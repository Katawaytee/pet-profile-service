const express = require("express");
const { createPet, getPets, getPet } = require("../controllers/pets");

const router = express.Router();

router.route("/").post(createPet).get(getPets);
router.route("/:id").get(getPet);

router.route("/user/:userId/pets").get(getPets);

module.exports = router;
