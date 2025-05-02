const UserModel = require('../../auth/models/user-model');
const UserInfoModel = require('../models/userInfo-model');
const ApiError = require('../../auth/exceptions/api-errors');
const {deleteFile} = require('../../S3/s3')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose');


class ProfileService{
    async updateBio(userId,bio){
        if(!userId || !bio){
            throw ApiError.BadRequest('user id or bio are required') 
        };
        let userInfo = await UserInfoModel.findOneAndUpdate({user: userId},{bio});
        return userInfo;
    };

    async getAvatar(userId){
        const userInfo = await UserInfoModel.findOne({user: userId});
        console.log(userInfo)
        if(!userInfo){
            throw ApiError.BadRequest('user info not found')    
        }
        return userInfo.avatar
    }

    async changeAvatar(userId,file){
        const url = file.location;
        let userInfo = await UserInfoModel.findOneAndUpdate({user: userId},{avatar:url});
        return userInfo 
    };

    async resetAvatar(userId) {
        if(!userId){
            throw ApiError.BadRequest('user id and url are required')    
        };
        const user = await UserInfoModel.findOne({user:userId})
        await deleteFile(user.avatar);
         await user.updateOne({ avatar: process.env.DEFAULT_AVATAR })
        return user;
    };

    async resetPassword(userId,pass,newPass) {
        const user = await UserModel.findById(userId);
        const isPassEquals = await bcrypt.compare(pass,user.password);

        if(!isPassEquals){
                    throw ApiError.BadRequest("wrong password")
                };

        const hashedPassword = await bcrypt.hash(newPass,3);
        await UserModel.findByIdAndUpdate(user._id,{password: hashedPassword})

        return user;
    };

    async deleteProfile(userId) {
        if(!userId){
            throw ApiError.BadRequest('userId is required')    
        };

        await UserModel.findByIdAndDelete(userId)
        await UserInfoModel.findOneAndDelete({user: userId});
    };
    async viewProfile(link){
    let userInfo;

     if (mongoose.Types.ObjectId.isValid(link)) {
      userInfo = await UserInfoModel.findOne({user: link});
    }
    
    if (!userInfo) {
      userInfo = await UserInfoModel.findOne({ link });
    }
    return userInfo
    };
    async viewMyProfile(userId){
        const userInfo = UserInfoModel.findOne({user: userId})

        if(!userInfo){
            throw ApiError.BadRequest("user not found")
        };

        return userInfo
    };

    async changeStatus(userId,status){
        const userInfo = UserInfoModel.findOne({user: userId});

        if(!userInfo){
            throw ApiError.BadRequest("user not found")
        };
        await userInfo.updateOne({hired: status})
    };
};

module.exports = new ProfileService();