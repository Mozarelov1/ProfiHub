const postService = require('../services/post-service');
const categoryService = require('../services/category-service');
class PostController{
    async createPost(req,res,next){
        try{
            const {titlе,experience,category,description,salary} = req.body;
            const token = req.cookies.refreshToken;
            const post = await postService.createPost(token,titlе,experience,category,description,salary);
            return res.json(post)
        }catch(e){
            next(e);
        }
    };

    async readPost(req,res,next){
        try{
            const link = req.params.link;
            const post = await postService.getPost(link);
            return res.json(post)
        }catch(e){
            next(e);
        }
    };

    async deletePost(req,res,next){
        try{
            const link = req.params.link;
            const post = await postService.deletePost(link);
            return res.json(post)
        }catch(e){
            next(e);
        }
    };

    async filterPost(req,res,next){
        try{
            const category = req.params.category;
            const posts = await categoryService.filterPosts(category);
            return res.json(posts)
        }catch(e){
            next(e);
        }
    };
    async getAllPosts(req,res,next){
        try{
            const posts = await postService.getAllPosts()
            return res.json(posts)
        }catch(e){
            next(e);
        }
    }

};


module.exports = new PostController();