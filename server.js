const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./configs/db");

dotenv.config({ path: "./configs/.env" });

connectDB();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const pets = require("./routes/pets");
app.use("/pets", pets);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
