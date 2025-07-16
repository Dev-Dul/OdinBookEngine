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

async function createNewPost(text, picUrl = null, authorId){
    await prisma.post.create({
        data: {
            text: text,
            picUrl: picUrl,
            author: { connect: authorId }
        }
    })
}

async function createNewComment(text, authorId, ){
    
}