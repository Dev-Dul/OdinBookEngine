const { Router } = require("express");
const gatesRouter = Router();
const gatesController = require("../controllers/gatesController");

gatesRouter.post("/signup", gatesController.createNewUserLocal);

module.exports = gatesRouter;