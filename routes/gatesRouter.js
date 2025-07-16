const { Router } = require("express");
const gatesRouter = Router();
const gatesController = require("../controllers/gatesController");

gatesRouter.get("/:userId", gatesController.getUserById);
gatesRouter.get("/user/:userName", gatesController.getUserByusername);
gatesRouter.post("/signup", gatesController.createNewUserLocal);

module.exports = gatesRouter;