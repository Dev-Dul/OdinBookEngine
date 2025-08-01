const db = require("../models/queries");
const { getIO } = require("../socket/socket");


async function createNewPost(req, res){
    const io = getIO();
    const { text, userId } = req.body;
    const picUrl  = req.file?.path;
    if(!req.isAuthenticated()) return res.status(403).json({ message: "Unauthorized" });
    if(!text || !userId ) return res.status(400).json({ message: "Incomplete Credentials!" });
    
    try{
        if(picUrl){
            const post = await db.createNewPost(text, Number(userId), picUrl);
            io.emit('new post', post);
        }else{
            const post = await db.createNewPost(text, Number(userId));
            io.emit('new post', post);
        }

        res.status(200).json({ message: "Post created successfully! "});
    }catch(err){
        res.status(500).json({ message: err.message });
    }
}


async function createNewComment(req, res){
    const io = getIO();
    const { text, userId, postId } = req.body;
    if(!req.isAuthenticated()) return res.status(403).json({ message: "Unauthorized" });
    if(!text || !userId || !postId) return res.status(400).json({ message: "Incomplete Credentials!" });
    
    try{
        const comment = await db.createNewComment(text, Number(userId), Number(postId));
        io.emit("new comment", { postId: Number(postId), comment: comment });
        res.status(200).json({ message: "Comment created successfully!", comment: comment });;
    }catch(err){
        res.status(500).json({ message: err.message });
    }
}


async function deletePost(req, res){
    const io = getIO();
    const { postId } = req.params;
    if(!req.isAuthenticated()) return res.status(403).json({ message: "Unauthorized" });
    if(!postId) return res.status(400).json({ message: "Incomplete Credentials!" });

    try {
      await db.deletePost(Number(postId));
      io.emit("delete post", Number(postId));
      res.status(200).json({ message: "Post deleted successfully! " });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }

}

async function deleteComment(req, res) {
  const io = getIO();
  const { commentId, postId } = req.params;
  if(!req.isAuthenticated()) return res.status(403).json({ message: "Unauthorized" });
  if(!commentId || !postId) return res.status(400).json({ message: "Incomplete Credentials!" });

  try{
    await db.deleteComment(Number(commentId));
    io.emit("delete comment", { postId: Number(postId), commentId: Number(commentId) });
    res.status(200).json({ message: "Comment deleted successfully!" });
  }catch(err){
    res.status(500).json({ message: err.message });
  }

}


async function createNewLike(req, res) {
  const io = getIO();
  const { userId } = req.body;
  const { postId } = req.params;

  if(!req.isAuthenticated()) return res.status(403).json({ message: "Unauthorized" });
  if(!userId || !postId) return res.status(400).json({ message: "Incomplete Credentials!" });

  try {
    const { liked } = await db.toggleLike(Number(userId), Number(postId));

    if(liked){
      io.emit("like", { postId: Number(postId), userId: Number(userId) });
    }else{
      io.emit("unlike", { postId: Number(postId), userId: Number(userId) });
    }
    
    
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}


async function  getPost(req, res){
    const { postId } = req.params;
    if(!req.isAuthenticated()) return res.status(403).json({ message: "Unauthorized" });
    if(!postId) return res.status(400).json({ message: "Incomplete Credentials!" });

     try{
       const post = await db.fetchPost(Number(postId));
       res.status(200).json({ success: true, post: post });
     }catch(err){
       res.status(500).json({ message: err.message });
     }
}

async function globalSearch(req, res){
    const { query } = req.query;
    if(!req.isAuthenticated()) return res.status(403).json({ message: "Unauthorized" });
    if(!query) return res.status(400).json({ message: "Invalid query!" });


     try{
      const { users, posts, comments } = await db.globalSearch(query);
       res.status(200).json({ message: "data fetch complete!", users: users, posts: posts, comments: comments });
     }catch(err){
       res.status(500).json({ message: err.message });
     }
}

async function getAllPosts(req, res){
    if(!req.isAuthenticated()) return res.status(403).json({ message: "Unauthorized" });
    
    try{
        const posts = await db.getAllPosts();
        res.status(200).json({ success: true, posts: posts });
    }catch(err){
        res.status(500).json({ message: err.message });
    }
}


module.exports = {
    getPost,
    deletePost,
    getAllPosts,
    globalSearch,
    deleteComment,
    createNewPost,
    createNewLike,
    createNewComment,
}
