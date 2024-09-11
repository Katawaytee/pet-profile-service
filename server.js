
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./configs/db');

dotenv.config({ path: './configs/.env' });

connectDB();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
