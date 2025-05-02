const jwt = require('jsonwebtoken')
const tokenModel = require('../models/token-model')
const UserModel = require('../models/user-model')

class TokenService{
    generateTokens(payload){
        const accessToken = jwt.sign(payload,process.env.JWT_ACCESS_SECRET,{expiresIn:'15m'});
        const refreshToken = jwt.sign(payload,process.env.JWT_REFRESH_SECRET,{expiresIn:'30d'});
        return{
            accessToken,refreshToken
        }
    };

    validateAccessToken(token){
        try{
            const userData = jwt.verify(token,process.env.JWT_ACCESS_SECRET);
            return userData;
        }catch(e){
            return null;
        }
    };
    validateRefreshToken(token){
        try{
            const userData = jwt.verify(token,process.env.JWT_REFRESH_SECRET);
            return userData;
        }catch(e){
            return null;
        }
    };

    async saveToken(userId,refreshToken){
        const tokenData = await tokenModel.findOne({user:userId});
        if(tokenData){
            tokenData.refreshToken = refreshToken
            return tokenData.save();
        }
        const token = await tokenModel.create({user:userId,refreshToken});
        return token;
    };

    async removeToken(refreshToken){
        const tokenData = await tokenModel.deleteOne({refreshToken});
        return tokenData;
    };
    async findToken(refreshToken){
        const tokenData = await tokenModel.findOne({refreshToken});
        return tokenData;
    };

    async findUserByRefreshToken(refreshToken){
        let tokenData;
         
        try {
             tokenData = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
            } catch (err) {
            return next(ApiError.BadRequest('Invalid or expired token'));
             };
        
     const user = await UserModel.findOne({ _id: tokenData.id });
     return user;
    }
};

module.exports = new TokenService();