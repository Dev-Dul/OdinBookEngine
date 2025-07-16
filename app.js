require('dotenv').config();
const express = require("express");
const session = require("express-session");


const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
app.listen(() => console.log(`app is listening on port: ${PORT}`));