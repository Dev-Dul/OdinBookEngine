const db = require("../models/queries");


async function createNewPost(req, res){
    const { text, userId } = req.body;
    const picUrl  = req.file?.path;
    if(!req.isAuthenticated()) return res.status(403).json({ message: "Unauthorized" });
    if(!text || !userId ) return res.status(400).json({ message: "Incomplete Credentials!" });
    
    try{
        if(picUrl){
            await db.createNewPost(text, picUrl, Number(userId));
        }else{
            await db.createNewPost(text, Number(userId));
        }

        res.status(200).json({ message: "Post created successfully! "});
    }catch(err){
        res.status(500).json({ message: err.message });
    }
}


async function createNewComment(req, res){
    const { text, userId, postId } = req.body;
    if(!req.isAuthenticated()) return res.status(403).json({ message: "Unauthorized" });
    if(!text || !userId || !postId) return res.status(400).json({ message: "Incomplete Credentials!" });
    
    try{
        await db.createNewComment(text, Number(userId), Number(postId));
        res.status(200).json({ message: "Comment created successfully! "});
    }catch(err){
        res.status(500).json({ message: err.message });
    }
}


async function deletePost(req, res){
    const { postId } = req.params;
    if(!req.isAuthenticated()) return res.status(403).json({ message: "Unauthorized" });
    if(!postId) return res.status(400).json({ message: "Incomplete Credentials!" });

    try {
      await db.deletePost(Number(postId));
      res.status(200).json({ message: "Post deleted successfully! " });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }

}

async function deleteComment(req, res) {
  const { commentId } = req.params;
  if(!req.isAuthenticated()) return res.status(403).json({ message: "Unauthorized" });
  if(!commentId) return res.satus(400).json({ message: "Incomplete Credentials!" });

  try{
    await db.deleteComment(Number(commentId));
    res.status(200).json({ message: "Comment deleted successfully! " });
  }catch(err){
    res.status(500).json({ message: err.message });
  }

}


async function createNewLike(req, res) {
  const { userId, postId } = req.params;
  if(!req.isAuthenticated()) return res.status(403).json({ message: "Unauthorized" });
  if(!userId || !postId) return res.satus(400).json({ message: "Incomplete Credentials!" });

  try{
    await db.createNewLike(Number(userId), Number(postId));
    res.status(200).json({ success: true });
  }catch(err){
    res.status(500).json({ message: err.message });
  }

}

async function removeLike(req, res) {
  const { userId } = req.body;
  const { postId } = req.params;
  if(!req.isAuthenticated()) return res.status(403).json({ message: "Unauthorized" });
  if(!userId || !postId) return res.satus(400).json({ message: "Incomplete or Missing Credentials!" });

  try{
    await db.removeLike(Number(userId), Number(postId));
    res.status(200).json({ success: true });
  }catch(err){
    res.status(500).json({ message: err.message });
  }

}

async function  getPost(req, res){
    const { postId } = req.params;
    if(!req.isAuthenticated()) return res.status(403).json({ message: "Unauthorized" });
    if(!postId) return res.satus(400).json({ message: "Incomplete Credentials!" });

     try{
       const post = await db.fetchPost(Number(postId));
       res.status(200).json({ success: true, post: post });
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
    removeLike,
    getAllPosts,
    deleteComment,
    createNewPost,
    createNewLike,
    createNewComment,
}
