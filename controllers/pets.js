const { bucket } = require("../configs/firebase");
const jwt = require("jsonwebtoken");

const Pet = require("../models/Pet");
const { Types } = require("mongoose");

exports.getPets = async (req, res) => {
  let query;

  query = Pet.find();

  try {
    const pets = await query;

    res.status(200).json({
      count: pets.length,
      data: pets,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getPet = async (req, res) => {
  try {
    let pid = req.params.id;
    const pet = await Pet.findById(pid);

    if (!pet) {
      return res.status(404).json({
        success: false,
        message: `No Pets with the id of ${pid}`,
      });
    }

    const imageURLs = await getBatchImageUrl(pet.image);

    const imagePath = {};

    for (let i = 0; i < pet.image.length; i++) {
      imagePath[imageURLs[i]] = pet.image[i];
    }

    pet.image = imageURLs;

    res.status(200).json({
      success: true,
      data: { ...pet._doc, imagePath: imagePath },
    });
  } catch (error) {
    console.error(String(error));
    return res.status(500).json({ success: false, massage: "Cannot find Pet" });
  }
};

exports.createPet = async (req, res) => {
  try {
    const imagePaths = await uploadImages(req.files);

    const newPet = await Pet.create({
      userId: req.body.user.userId,
      petName: req.body.petName,
      species: req.body.species,
      gender: req.body.gender,
      age: req.body.age,
      image: imagePaths,
      behaviorDescription: req.body.behaviorDescription,
      vaccinatedComment: req.body.vaccinatedComment,
    });

    return res.status(201).json({
      success: true,
      data: newPet,
    });
  } catch (err) {
    console.error(String(err.message));
    res.status(400).json({ message: err.message });
  }
};

exports.updatePet = async (req, res) => {
  try {
    let pid = req.params.id;

    if (!pid) {
      return res.status(400).json({
        success: false,
        message: "petId not specified",
      });
    }

    if (!Types.ObjectId.isValid(pid)) {
      return res.status(400).json({
        success: false,
        message: "petId is invalid",
      });
    }

    const targetPet = await Pet.findById(pid);

    if (!targetPet) {
      return res.status(404).json({
        success: false,
        message: `No Pet with the id of ${pid}`,
      });
    }

    if (targetPet.userId !== req.body.user.userId) {
      return res.status(401).json({
        success: false,
        message: "Only the pet owner can edit a pet.",
      });
    }

    const newPetInfo = { ...req.body };

    if (newPetInfo.image) {
      newPetInfo.image = JSON.parse(newPetInfo.image);

      const newImagePaths = await uploadImages(req.files);

      let imageIndex = 0;
      let newPathsIndex = 0;

      while (newPathsIndex < newImagePaths.length) {
        if (!newPetInfo.image[imageIndex].startsWith("pet-image/")) {
          newPetInfo.image[imageIndex] = newImagePaths[newPathsIndex];
          newPathsIndex++;
        }
        imageIndex++;
      }
    } else if (req.files) {
      newPetInfo.image = await uploadImages(req.files);
    }

    for (const key of Object.keys(newPetInfo)) {
      if (newPetInfo[key] !== undefined) {
        targetPet[key] = newPetInfo[key];
      }
    }

    await targetPet.save();

    console.log(
      `[${new Date()}] updatePet: user ${
        req.body.user.userId
      } petId ${pid} success`
    );

    return res.status(200).json({
      success: true,
      data: targetPet,
    });
  } catch (err) {
    console.error(`[${new Date()}] updatePet: user ${req.body.user.userId} petId ${pid} failed`);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.deletePet = async (req, res) => {
  try {
    let pid = req.params.id;

    if (!pid) {
      return res.status(400).json({
        success: false,
        message: "petId not specified",
      });
    }

    if (!Types.ObjectId.isValid(pid)) {
      return res.status(400).json({
        success: false,
        message: "petId is invalid",
      });
    }

    const targetPet = await Pet.findById(pid);

    if (!targetPet) {
      return res.status(404).json({
        success: false,
        message: `No Pet with the id of ${pid}`,
      });
    }

    if (targetPet.userId !== req.body.user.userId) {
      res.status(401).json({
        success: false,
        message: "Only the pet owner can delete a pet.",
      });
    }

    await targetPet.deleteOne();

    console.log(
      `[${new Date()}] deletePet: user ${
        req.body.user.userId
      } petId ${pid} success`
    );

    return res.status(200).json({
      success: true,
      data: {},
      message: `Pet ${pid} is now deleted.`,
    });
  } catch (err) {
    console.error("deletePet:", String(err.message));
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getRandomPets = async (req, res) => {
  try {
    const bearer = req.headers["authorization"];

    let randomPets;
    let userId;

    if (!bearer) {
      randomPets = await Pet.aggregate([
        { $sample: { size: 3 } },
        {
          $project: {
            _id: 0,
            petId: "$_id",
            petName: 1,
            species: 1,
            gender: 1,
            age: 1,
            behaviorDescription: 1,
            image: { $arrayElemAt: ["$image", 0] },
          },
        },
      ]);
    } else {
      const token = bearer.split(" ")[1];
      const user = jwt.decode(token);
      userId = user.userId;

      randomPets = await Pet.aggregate([
        { $match: { userId: { $ne: user.userId } } },
        { $sample: { size: 3 } },
        {
          $project: {
            _id: 0,
            petId: "$_id",
            petName: 1,
            species: 1,
            gender: 1,
            age: 1,
            behaviorDescription: 1,
            image: { $arrayElemAt: ["$image", 0] },
          },
        },
      ]);
    }

    const petPromises = randomPets.map(async (pet) => {
      if (!pet.image) return { ...pet, image: "" };
      const imageUrl = await getImageUrl(pet.image);
      pet.image = imageUrl;
      return pet;
    });

    const randomPetsWithImage = await Promise.all(petPromises);

    console.log(`[${new Date()}] getRandomPets: userId = ${userId} success`);

    return res.status(200).json({
      success: true,
      data: randomPetsWithImage,
    });
  } catch (err) {
    console.error("getRandomPets:", String(err.message));
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getMyPets = async (req, res) => {
  try {
    const myPets = await Pet.find(
      { userId: req.body.user.userId },
      {
        _id: 0,
        petId: "$_id",
        petName: 1,
        image: { $slice: ["$image", 1] },
      }
    );

    const petPromises = myPets.map(async (pet) => {
      if (!pet.image[0]) return { ...pet._doc, image: "" };
      const imageUrl = await getImageUrl(pet.image[0]);
      return { ...pet._doc, image: imageUrl };
    });

    const myPetsWithImage = await Promise.all(petPromises);

    console.log(
      `[${new Date()}] getMyPets: user ${req.body.user.userId} success`
    );

    return res.status(200).json({
      success: true,
      data: myPetsWithImage,
    });
  } catch (err) {
    console.error(String(err));
    res.status(500).json({
      success: false,
      message: String(err.message),
    });
  }
};

const uploadImages = async (files) => {
  if (!files) return [];

  try {
    const uploadPromises = files.map(async (file) => {
      const fileName = `${Date.now()}-${file.originalname}`;
      const filePath = `pet-image/${fileName}`;
      const fileRef = bucket.file(filePath);

      await fileRef.save(file.buffer, {
        metadata: {
          contentType: file.mimetype,
        },
      });

      return filePath;
    });

    const imagePaths = await Promise.all(uploadPromises);

    return imagePaths;
  } catch (err) {
    throw new Error("Firebase upload failed");
  }
};

const getImageUrl = async (imagePath) => {
  try {
    const file = bucket.file(imagePath);

    const [exists] = await file.exists();
    if (!exists) {
      return "";
    }

    const [signedUrl] = await file.getSignedUrl({
      action: "read",
      expires: Date.now() + 24 * 60 * 60 * 1000,
    });

    return signedUrl;
  } catch (err) {
    throw new Error("Error getting image URL");
  }
};

const getBatchImageUrl = async (imagePaths) => {
  try {
    const urlPromises = imagePaths.map(async (imagePath) => {
      return await getImageUrl(imagePath);
    });

    return Promise.all(urlPromises);
  } catch (err) {
    throw new Error("Error getting batch image URL");
  }
};
