const db = require("../models/queries");
const bcrypt = require("bcryptjs");


async function createNewUserLocal(req, res){
    const { username, email, password } = req.body;
    if(!username || !email || !password) return res.status(400).json({ message: "Incomplete Credentials" });

    try{
        const hashedPassword = bcrypt.hash(password, 10);
        await db.createNewUserLocal(username, email, hashedPassword);
        res.status(200).json({ message: "User account created successfully!" });
    }catch(err){
        res.status(500).json({ message: err.message });
    }

}

async function getUserById(req, res){
    const { userId } = req.body;
    if(!userId) return res.status(400).json({ message: "Incomplete Credentials!" });

    try{
        const user = await db.getUserById(Number(userId));
        res.status(200).json({ status: true, user: user });
    }catch(err){
        res.status(500).json({ message: err.message });
    }

}


async function getUserByUsername(req, res){
    const { userName } = req.body;
    if(!userName) return res.status(400).json({ message: "Incomplete Credentials!" });

    try{
        const user = await db.getUserByUsername(userName);
        res.status(200).json({ status: true, user: user });
    }catch(err){
        res.status(500).json({ message: err.message });
    }

}


module.exports = [
    getUserById,
    getUserByUsername,
    createNewUserLocal,
]