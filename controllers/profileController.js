const db = require("../models/queries");


async function addNewFriend(req, res){
    const { userId } = req.params;
    const { friendId } = req.body;

    if(!req.isAuthenticated()) return res.status(403).json({ message: "Unauthorized" });
    if(!userId || !friendId) return res.status(400).json({ message: "Incomplete or missing Credentials!" });

    try{
        await db.addNewFriend(Number(userId), Number(friendId));
        res.status(200).json({ message: "New friend request sent!" });
    }catch(err){
        res.status(500).json({ message: err.message });
    }
}


async function acceptFriendRequest(req, res){
    const { userId } = req.params;
    const { friendId } = req.body;

    if(!req.isAuthenticated()) return res.status(403).json({ message: "Unauthorized" });
    if(!userId || !friendId) return res.status(400).json({ message: "Incomplete or missing Credentials!" });

    try{
        await db.acceptFriendRequest(Number(userId), Number(friendId));
        res.status(200).json({ message: "Friend request accepted!" });
    }catch(err){
        res.status(500).json({ message: err.message });
    }
}


async function rejectFriendRequest(req, res){
    const { userId } = req.params;
    const { friendId } = req.body;

    if(!req.isAuthenticated()) return res.status(403).json({ message: "Unauthorized" });
    if(!userId || !friendId) return res.status(400).json({ message: "Incomplete or missing Credentials!" });

    try{
        await db.rejectFriendRequest(Number(userId), Number(friendId));
        res.status(200).json({ message: "Friend request rejected!" });
    }catch(err){
        res.status(500).json({ message: err.message });
    }
}


async function removeFriend(req, res){
    const { userId, friendId } = req.params;

    if(!req.isAuthenticated()) return res.status(403).json({ message: "Unauthorized" });
    if(!userId || !friendId) return res.status(400).json({ message: "Incomplete or missing Credentials!" });

    try{
        await db.removeFriend(Number(userId), Number(friendId));
        res.status(200).json({ message: "Friend removed!" });
    }catch(err){
        res.status(500).json({ message: err.message });
    }
}

module.exports = {
    addNewFriend,
    removeFriend,
    acceptFriendRequest,
    rejectFriendRequest,
}