const Pet = require("../models/pets");

exports.getPets = async (req, res) => {
  try {
    const pets = await Pet.find();
    res.json(pets);
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
  const pet = new Pet({
    name: req.body.name,
    species: req.body.species,
    gender: req.body.gender,
    age: req.body.age,
  });
  try {
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
