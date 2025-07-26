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
            posts: true,
            likes: true,
            comments: true,
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
        posts: true,
        likes: true,
        comments: true,
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

async function createNewPost(text, picUrl = null, authorId){
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
            comment: {
                include: {
                    author: true
                }
            },
            like: true,
        }
    });
}

async function globalSearch(query){
    const search = query.trim();
    const [users, posts, comments] = await promise.all([
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
            include: { author: true }
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
    return await prisma.post.findMany();
}

async function createNewComment(text, authorId, postId){
    await prisma.comment.create({
        data: {
            text: text,
            author: { connect: { id: authorId } },
            post: { connect: { id: postId } }
        }
    })
}


async function deleteComment(commentId){
    await prisma.comment.delete({
        where: { id: commentId }
    });
}

async function createNewLike(userId, postId){
    await prisma.like.create({
        data: {
            user: { connect: { id: userId } },
            post: { connect: { id: postId } },
        }
    });
}


async function removeLike(userId, postId){
    await prisma.like.delete({
        where: { 
            userId_postId:{
                userId: userId,
                postId: postId
            }
        }
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
    createNewLike,
    removeLike,
    deletePost,
    updateProfile,
    deleteComment,
    createNewUserLocal,
    getUserByUsername,
    findOrCreateByGithub,
}