const db = require("../models/queries");
const { getIO } = require("../socket/socket");


async function updateProfile(req, res){
    const { userId } = req.params;
    const { username, email, bio } = req.body;
    const profilePic  = req.file?.path;

    if(!req.isAuthenticated()) return res.status(403).json({ message: "Unauthorized" });
    if(!userId || !username || !email) return res.status(400).json({ message: "Incomplete or missing Credentials!" });
    
    try{
        if(bio){
            if(profilePic){
                await db.updateProfile(Number(userId), username, email, bio, profilePic);
            }else{
                await db.updateProfile(Number(userId), username, email, bio);
            }
        }else{
            await db.updateProfile(Number(userId), username, email);
        }
        res.status(200).json({ message: "Profile updated successfully!", user: req.user });  

    }catch(err){
        res.status(500).json({ message: err.message });
    }
}

async function hydrateUser(req, res){
    if(!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    if(!req.session) return res.status(401).json({ message: "Expired" });

    res.status(200).json({ message: "Success", user: req.user });
}

async function addNewFriend(req, res){
    const io = getIO();
    const { userId } = req.params;
    const { friendId } = req.body;

    if(!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    if(!userId || !friendId) return res.status(400).json({ message: "Incomplete or missing Credentials!" });

    try{
        await db.addNewFriend(Number(userId), Number(friendId));
        io.emit('friend');
        res.status(200).json({ message: "New friend request sent!" });
    }catch(err){
        res.status(500).json({ message: err.message });
    }
}


async function acceptFriendRequest(req, res){
    const io = getIO();
    const { userId } = req.params;
    const { friendId } = req.body;

    if(!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    if(!userId || !friendId) return res.status(400).json({ message: "Incomplete or missing Credentials!" });

    try{
        await db.acceptFriendRequest(Number(userId), Number(friendId));
        io.emit('friend');
        res.status(200).json({ message: "Friend request accepted!" });
    }catch(err){
        res.status(500).json({ message: err.message });
    }
}


async function rejectFriendRequest(req, res){
    const io = getIO();
    const { userId } = req.params;
    const { friendId } = req.body;

    if(!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    if(!userId || !friendId) return res.status(400).json({ message: "Incomplete or missing Credentials!" });

    try{
        await db.rejectFriendRequest(Number(userId), Number(friendId));
        io.emit("friend");

        res.status(200).json({ message: "Friend request rejected!" });
    }catch(err){
        res.status(500).json({ message: err.message });
    }
}


async function removeFriend(req, res){
    const io = getIO();
    const { userId, friendId } = req.params;

    if(!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    if(!userId || !friendId) return res.status(400).json({ message: "Incomplete or missing Credentials!" });

    try{
        await db.removeFriend(Number(userId), Number(friendId));
        io.emit('friend');
        res.status(200).json({ message: "Friend removed!" });
    }catch(err){
        res.status(500).json({ message: err.message });
    }
}


async function getUser(req, res){
    const { userId } = req.params;
    if(!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    if(!userId) return res.status(400).json({ message: "Incomplete or missing Credentials!" });

    try{
        const user = await db.getUserById(Number(userId));
        res.status(200).json({ success: true, user: user });
    }catch(err){
        res.status(500).json({ message: err.message });
    }
}

async function getAllUsers(req, res){
    if(!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });

    try{
        let users = await db.getAllUsers();
        users = users.filter(user => user.id !== req.user.id);
        res.status(200).json({ success: true, users: users });
    }catch(err){
        res.status(500).json({ message: err.message });
    }
}


module.exports = {
    getUser,
    getAllUsers,
    hydrateUser,
    addNewFriend,
    removeFriend,
    updateProfile,
    acceptFriendRequest,
    rejectFriendRequest,
}