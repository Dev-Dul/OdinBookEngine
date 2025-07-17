require('dotenv').config();
const express = require("express");
const session = require("express-session");
const { PrismaClient } = require("./generated/prisma/client");
const { passport } = require("./auth/passport-config");
const postRouter = require("./routes/postRouter");
const gatesRouter = require("./routes/gatesRouter");
const profileRouter = require("./routes/profileRouter");


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/v1/", gatesRouter);
app.use("/api/v1/posts/", postRouter);
app.use("/api/v1/profiles/", profileRouter);


app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});



const PORT = process.env.PORT || 3000;
app.listen(() => console.log(`app is listening on port: ${PORT}`));