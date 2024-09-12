const Pet = require("../models/Pet");

exports.getPets = async (req, res) => {
  let uid = req.params.userId;
  let query;

  if (uid) {
    query = Pet.find({ userId: uid });
  } else {
    query = Pet.find();
  }
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

// Get One Pet
exports.getPet = async (req, res) => {
  try {
    let pid = req.params.id;
    const pet = await Pet.findOne({ petId: pid });

    if (!pet) {
      return res.status(404).json({
        success: false,
        message: `No Pets with the id of ${pid}`,
      });
    }

    res.status(200).json({
      success: true,
      data: pet,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, massage: "Cannot find Pet" });
  }
};

exports.createPet = async (req, res) => {
  try {
    // Get the count of pets in the database using the PET model
    const petCount = await Pet.countDocuments();
    // Assign petID as petCount + 1
    let pid = petCount + 1;
    const pet = new Pet({
      petId: pid,
      userId: req.body.userId,
      petName: req.body.petName,
      species: req.body.species,
      gender: req.body.gender,
      age: req.body.age,
      image: req.body.image,
    });

    const newPet = await pet.save();
    res.status(201).json(newPet);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updatePet = async (req, res) => {
  try {
    let pid = req.params.id;
    const pet = await Pet.findById(pid);

    if (!pet) {
      return res.status(404).json({
        success: false,
        message: `No Pets with the id of ${pid}`,
      });
    }

    const updatedPet = await Pet.findByIdAndUpdate(pid, req.body, {
      new: true,
      runValidators: true,
    });
    res.json(updatedPet);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deletePet = async (req, res) => {
  try {
    let pid = req.params.id;
    const pet = await Pet.findById(pid);

    if (!pet) {
      return res.status(404).json({
        success: false,
        message: `No Pet with the id of ${pid}`,
      });
    }
    await pet.deleteOne();
    res.status(200).json({
      success: true,
      data: {},
      message: `Pet ${pid} is now deleted.`,
    });
  } catch {
    res.status(400).json({ message: err.message });
  }
};
