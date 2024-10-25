
const { bucket } = require('../configs/firebase');

const Pet = require("../models/Pet");
const { Types } = require("mongoose");

exports.getPets = async (req, res) => {
    let uid = req.params.userId;
    let query;
    // let viaUser = false;
    console.log(uid);
    if (uid) {
        console.log(req.params.userId);
        query = Pet.find({ userId: uid }).select(
            "petName species gender age behaviorDescription image"
        );
        // viaUser = true;
    } else {
        query = Pet.find();
        console.log("no User");
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

// TODO: implement resolve image url logic
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
            vaccinatedComment: req.body.vaccinatedComment
        });

        return res.status(201).json({
            success: true,
            data: newPet,
        });

    } catch (err) {
        console.error(String(err.message))
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

        const newPetInfo = { ...req.body };

        if (req.files) {
            newPetInfo.image = await uploadImages(req.files);
        }

        const updatedPet = await Pet.findByIdAndUpdate(pid, newPetInfo, {
            new: true,
        });

        if (!updatedPet) {
            return res.status(404).json({
                success: false,
                message: `No Pets with the id of ${pid}`,
            });
        }

        return res.status(200).json({
            success: true,
            data: updatedPet,
        });
    } catch (err) {
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

        const deletedPet = await Pet.findByIdAndDelete(pid);

        if (!deletedPet) {
            return res.status(404).json({
                success: false,
                message: `No Pets with the id of ${pid}`,
            });
        }

        return res.status(200).json({
            success: true,
            data: {},
            message: `Pet ${pid} is now deleted.`,
        });
    } catch {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

// TODO: exclude own pets
// TODO: implement resolve image url logic
exports.getRandomPets = async (req, res) => {
    try {
        const randomPets = await Pet.aggregate([
            { $sample: { size: 3 } },
            {
                $project: {
                    _id: 0,
                    petId: "$_id",
                    petName: 1,
                    species: 1,
                    gender: 1,
                    age: 1,
                    image: { $arrayElemAt: ["$image", 0] },
                },
            },
        ]);

        return res.status(200).json({
            success: true,
            data: randomPets,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

 // TODO: implement
exports.getMyPets = async (req, res) => {
    
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
                    contentType: file.mimetype
                }
            });

            return filePath;

        });

        const imagePaths = await Promise.all(uploadPromises);

        return imagePaths;

    } catch (err) {
        throw new Error("Firebase upload failed");
    }
}

 // TODO: implement
const getImageUrl = () => {

}