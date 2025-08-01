const { PrismaClient } = require("../generated/prisma/client");
const prisma = new PrismaClient();


async function createNewUserLocal(username, email, password){
    await prisma.user.create({
        data: {
            username: username,
            email: email,
            password: password
        }
    });
}

async function findOrCreateByGithub(profile){
    const findUser = await prisma.user.findUnique({
        where: { githubId: profile.githubId }
    });

    if(!findUser){
        const user = await prisma.user.create({
            data: {
                githubId: profile.githubId,
                githubUsername: profile.githubUsername,
                avatarUrl: profile.pic,
            }
        });

        return user;
    }

    return findUser;
}

async function getUserById(userId){
    return await prisma.user.findUnique({
        where: { id: userId },
        include: {
            posts: {
                include: {
                    author: true,
                    likes: true,
                    comments: {
                        include: {
                            author: true
                        }
                    },
                }
            },
            likes: true,
            comments: {
                include: {
                    author: true,
                }
            },
            friends: {
                include: {
                    owner: true,
                }
            },
            friendships: {
                include:{
                    friend: true,
                }
            },
        }
    });
}

async function getUserByUsername(username){
    return await prisma.user.findUnique({
      where: { username: username },
      include: {
        posts: {
            include: {
                author: true,
                likes: true,
                comments: {
                    include: {
                        author: true
                    }
                },
            }
        },
        likes: true,
        comments: {
            include: {
                author: true,
            }
        },
        friends: {
          include: {
            owner: true,
          },
        },
        friendships: {
          include: {
            friend: true,
          },
        },
      },
    });
}

async function updateProfile(userId, username, email, bio = null, picUrl = null){
    await prisma.user.update({
        where: { id: userId },
        data: {
            username: username,
            email: email,
            bio: bio,
            avatarUrl: picUrl
        }
    })
}

async function addNewFriend(ownerId, friendId){
    await prisma.friend.create({
        data: {
            owner: { connect: { id: ownerId } },
            friend: { connect: { id: friendId } },
            status: 'PENDING',
        }
    });
}

async function acceptFriendRequest(ownerId, friendId){
    await prisma.friend.update({
        where: {
            ownerId: ownerId,
            friendId: friendId
        },

        data: {
            status: 'ACCEPTED',
        }
        
    });
}


async function rejectFriendRequest(ownerId, friendId){
    await prisma.friend.update({
        where: {
            ownerId: ownerId,
            friendId: friendId
        },

        data: {
            status: 'REJECTED',
        }

    });
}


async function removeFriend(ownerId, friendId){
    await prisma.friend.delete({
        where: {
            ownerId_friendId: {
                ownerId: ownerId,
                friendId: friendId
            }
        },
    });
}

async function fetchFriend(friendId){
    return await prisma.friend.findUnique({
        where: { id: friendId }
    })
}

async function getAllUsers(){
    return await prisma.user.findMany();
}

async function createNewPost(text, authorId, picUrl = null){
    await prisma.post.create({
        data: {
            text: text,
            picUrl: picUrl,
            author: { connect: { id: authorId } }
        }
    })
}

async function fetchPost(postId){
    return await prisma.post.findUnique({
        where: { id: postId },
        include: {
            comments: {
                include: {
                    author: true
                }
            },
            author: true,
            likes: true,
        }
    });
}

async function globalSearch(query){
    const search = query.trim();
    const [users, posts, comments] = await Promise.all([
        prisma.user.findMany({
            where: {
                OR: [
                    { email: { contains: search, mode: "insensitive" }},
                    { username: { contains: search, mode: "insensitive" }},
                ]
            }
        }),

        prisma.post.findMany({
            where: { text: { contains: search, mode: "insensitive" }},
            include: {
                author: true, 
                likes: true, 
                comments: {
                    include: {
                        author: true
                    }
                }, 
            }
        }),

        prisma.comment.findMany({
            where: { text: { contains: search, mode: "insensitive" }},
            include: { author: true }
        }),    
    ])

    return {
        users,
        posts,
        comments
    }
}

async function getAllPosts(){
    return await prisma.post.findMany({
      include: {
        comments: {
          include: {
            author: true,
          },
        },
        author: true,
        likes: true,
      },
    });
}

async function createNewComment(text, authorId, postId){
    return await prisma.comment.create({
        data: {
            text: text,
            author: { connect: { id: authorId } },
            post: { connect: { id: postId } }
        },

        include: {
            author: true,
        }
    })
}


async function deleteComment(commentId){
    return await prisma.comment.delete({
        where: { id: commentId }
    });
}

async function toggleLike(userId, postId) {
  const existingLike = await prisma.like.findUnique({
    where: {
      userId_postId: {
        userId,
        postId,
      },
    },
  });

  if(existingLike){
    await prisma.like.delete({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });
    return { liked: false };
  } else {
    await prisma.like.create({
      data: {
        user: { connect: { id: userId } },
        post: { connect: { id: postId } },
      },
    });
    return { liked: true };
  }
}


async function getCommentCount(postId){
    return await prisma.comment.findMany({
        where: { postId: postId }
    });
}


async function deletePost(postId){
    await prisma.post.delete({
       where: { id: postId }
    });
}

module.exports = {
    fetchPost,
    getUserById,
    getAllPosts,
    getAllUsers,
    addNewFriend,
    fetchFriend,
    removeFriend,
    globalSearch,
    acceptFriendRequest,
    rejectFriendRequest,
    createNewPost,
    createNewComment,
    toggleLike,
    deletePost,
    updateProfile,
    deleteComment,
    getCommentCount,
    createNewUserLocal,
    getUserByUsername,
    findOrCreateByGithub,
}