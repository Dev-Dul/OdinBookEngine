const { Router } = require("express");
const profileRouter = Router();
const profileController = require("../controllers/profileController");

profileRouter.post("/:userId/friends/new", profileController.addNewFriend);
profileRouter.post("/:userId/friends/accept", profileController.acceptFriendRequest);
profileRouter.post("/:userId/friends/reject", profileController.rejectFriendRequest);
profileRouter.post("/:userId/friends/:friendId/remove", profileController.removeFriend);



module.exports = profileRouter;