const PostModel = require('../models/post-model');

class CategoryService{
    async filterPosts(category){
        if(!category){
            throw ApiError.BadRequest('category not found');
        }
        const posts = await PostModel.find({category});
        if(!posts){
            throw ApiError.BadRequest('posts not found');
        }
        return posts;
    };
}

module.exports = new CategoryService();