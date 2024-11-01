// const express = require("express");
// const dotenv = require("dotenv");
// const cors = require("cors");
// const connectDB = require("./configs/db");

import express from "express";
import cors from "cors";
import connectDB from "./configs/db.js"; // Use relative path and include .js

import dotenv from "dotenv";

import pets from "./routes/pets.js"; // Include .js in import

dotenv.config({ path: "./configs/.env" });

connectDB();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// const pets = require("./routes/pets");
app.use("/", pets);
// app.use("/user/:uesrId/pets", pets);

export default app;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
