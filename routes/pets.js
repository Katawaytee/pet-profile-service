import express from "express";
import {
  createPet,
  getPets,
  getPet,
  getRandomPets,
  updatePet,
  deletePet,
  getMyPets,
} from "../controllers/pets.js";
import multer from "multer";
import authenticate from "../middlewares/authenticate.js";

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

// Route for getting all pets and creating a new pet
router
  .route("/pets")
  .get(getPets)
  .post(upload.array("images", 10), authenticate, createPet);

// Route for getting random pets
router.route("/pets/random").get(authenticate, getRandomPets);

// Route for getting the authenticated user's pets
router.route("/pets/user").get(authenticate, getMyPets);

// Routes for getting, updating, and deleting a specific pet by ID
router
  .route("/pets/:id")
  .get(getPet)
  .put(upload.array("images", 10), authenticate, updatePet)
  .delete(authenticate, deletePet);

export default router;
