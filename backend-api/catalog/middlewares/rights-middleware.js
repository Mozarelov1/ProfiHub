const PostModel = require('../models/post-model');
const UserModel = require('../../auth/models/user-model');
const ApiError = require('../../auth/exceptions/api-errors');
const jwt = require('jsonwebtoken');
module.exports = async function(req,res,next){
    try{
        const link = req.params.link;
        const post = await PostModel.findOne({link});
        if(!post){
            return next(ApiError.BadRequest('post not found'))
        };

        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return next(ApiError.BadRequest('No refresh token provided'));
        }

        let tokenData;
        try {
            tokenData = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        } catch (err) {
            return next(ApiError.BadRequest('Invalid or expired token'));
        }
        
        
        const user = await UserModel.findOne({ _id: tokenData.id });
        if (!user) {
            return next(ApiError.BadRequest('author not found'));
        };

        if (user._id.toString() !== post.author.toString()) {
            return next(ApiError.NotEnoughRights());
          }
    
        next();
    }catch(e){
        return next(ApiError.NotEnoughRights());
    }
}