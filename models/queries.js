const { PrismaClient } = require("../generated/prisma/client");
const prisma = PrismaClient();


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
            comment: true,
            friends: {
                friend: true,
            },
            friendships: {
                owner: true,
            },
        }
    });
}

async function getUserByUsername(username){
    return await prisma.user.findUnique({
        where: { username: username },
    });
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
              author: true
            },
            like: true,
        }
    });
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
    addNewFriend,
    fetchFriend,
    removeFriend,
    acceptFriendRequest,
    rejectFriendRequest,
    createNewPost,
    createNewComment,
    createNewLike,
    removeLike,
    deletePost,
    deleteComment,
    createNewUserLocal,
    getUserByUsername,
    findOrCreateByGithub,
}