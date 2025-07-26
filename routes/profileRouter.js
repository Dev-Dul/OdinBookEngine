const { Router } = require("express");
const profileRouter = Router();
const upload = require("../models/multer-config");
const profileController = require("../controllers/profileController");

profileRouter.get("/all", profileController.getAllUsers);
profileRouter.get("/hydrate", profileController.hydrateUser);

profileRouter.post("/:userId/update", upload.single('profilePic'), profileController.updateProfile);
profileRouter.post("/:userId/friends/new", profileController.addNewFriend);
profileRouter.post("/:userId/friends/accept", profileController.acceptFriendRequest);
profileRouter.post("/:userId/friends/reject", profileController.rejectFriendRequest);
profileRouter.post("/:userId/friends/:friendId/remove", profileController.removeFriend);



module.exports = profileRouter;