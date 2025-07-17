const { Router } = require("express");
const gatesRouter = Router();
const gatesController = require("../controllers/gatesController");
const { handleLogin } = require("../auth/passport-config");

// get routes
gatesRouter.get("/:userId", gatesController.getUserById);
gatesRouter.get("/user/:userName", gatesController.getUserByusername);

// post routes
gatesRouter.post("/login", handleLogin);
gatesRouter.post("/signup", gatesController.createNewUserLocal);

module.exports = gatesRouter;