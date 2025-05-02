const uuid = require('uuid');
const PostModel = require('../models/post-model');
const UserModel = require('../../auth/models/user-model');
const ApiError = require('../../auth/exceptions/api-errors');
const jwt = require('jsonwebtoken')

class PostService{
    async createPost(token,titlе,experience,category,description,salary){
        let decoded;
        try{
            decoded = jwt.verify(token,process.env.JWT_REFRESH_SECRET);
        }catch(e){
            return next(ApiError.BadRequest('invalid token'))
        };
        
        const userId = decoded.id;
        const user = await UserModel.findById(userId);
        
        if(!user){
            throw ApiError.BadRequest('user not found')
        }
        const link = uuid.v4();
        const post = await PostModel.create({author:userId,titlе,experience,category,description,salary,link});
        
        await post.save();
        return post
    };
    async getPost(link){
        const post = await PostModel.findOne({link});
        if(!post){
            throw ApiError.BadRequest('post not found')
        };
        return post;
    };

    async updatePost(link,changes){
        const postData = await PostModel.findOne({link});

        if(!postData){
            throw ApiError.BadRequest('post not found');
        };
        if(!changes){
            throw ApiError.BadRequest('no changes');
        };
    
        Object.assign(postData,changes)
        await postData.save()
        return postData;
    };

    async deletePost (link){
    
        const postData = await PostModel.findOne({link});
        if(!postData){
            throw ApiError.BadRequest('post not found');
        };
        await postData.deleteOne();
        return postData;
    };

    async getAllPosts(){
        const postsData = await PostModel.find({});
        if(!postsData){
            throw ApiError.BadRequest('posts not found');
        };

        return postsData
    }

}

module.exports = new PostService();