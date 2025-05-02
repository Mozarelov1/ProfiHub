const profileService = require('../services/profile-service');
const tokenService = require('../../auth/services/token-service')
const ApiError = require('../../auth/exceptions/api-errors');
const UserModel = require('../../auth/models/user-model');


class MgmtContoller{

    async viewProfile(req,res,next){
        try{
            const link = req.params.link;
            if(!link){
                throw ApiError.BadRequest("User not found");
            };

            const userInfo = await profileService.viewProfile(link);
            const user = await UserModel.findById(userInfo.user) 

            res.json({...userInfo.toObject(),login: user.login })
        }catch(e){
            next(e)
        }
    }

    async viewMyProfile(req,res,next){
        try{
            const refreshToken = req.cookies.refreshToken;

            if(!refreshToken){
                throw ApiError.UnauthorizedError()
            };

            const user = await tokenService.findUserByRefreshToken(refreshToken); 

            const userInfo = await profileService.viewMyProfile(user._id);
            res.json({...userInfo.toObject(),login: user.login })
        }catch(e){
            next(e)
        }
    }

    async updateProfileBio(req,res,next){
        try{
            const {bio} = req.body
            if(!bio){
                throw ApiError.BadRequest('Bio is required')
            };

            const refreshToken = req.cookies.refreshToken;

            if(!refreshToken){
                throw ApiError.UnauthorizedError()
            };

            const user = await tokenService.findUserByRefreshToken(refreshToken);
                    const userBio = await profileService.updateBio(user._id,bio);

                    res.json(userBio);
        }catch(e){
            next(e)
        }
    };

    async getAvatar(req,res,next){
        try{
            const refreshToken = req.cookies.refreshToken;

            if(!refreshToken){
                throw ApiError.UnauthorizedError()
            };

            const user = await tokenService.findUserByRefreshToken(refreshToken);
            const userAvatar = await profileService.getAvatar(user._id)

            res.json({"avatar": userAvatar})
        }catch(e){
            next(e)
        }
    }

    async changeAvatar(req,res,next){
        try{
            const refreshToken = req.cookies.refreshToken;
            if(!req.file){
                throw ApiError.BadRequest('Image is required')
            }

            if(!refreshToken){
                throw ApiError.UnauthorizedError()
            };

            const user = await tokenService.findUserByRefreshToken(refreshToken);

                    const userAvatar = await profileService.changeAvatar(user._id,req.file);
                    res.json({userAvatar});
        }catch(e){
            next(e)
        }
    };

    async resetAvatar(req,res,next){
        try{
            const refreshToken = req.cookies.refreshToken;

            if(!refreshToken){
                throw ApiError.UnauthorizedError()
            };

            const user = await tokenService.findUserByRefreshToken(refreshToken);
                    const userAvatar = await profileService.resetAvatar(user._id);
                    res.json(userAvatar)
        }catch(e){
            next(e)
        }
    }

    async deleteProfile(req,res,next){
        try{
            const refreshToken = req.cookies.refreshToken;

            if(!refreshToken){
                throw ApiError.UnauthorizedError()
            };

            const user = await tokenService.findUserByRefreshToken(refreshToken);
            const userDelete = await profileService.deleteProfile(user._id);
            res.json(userDelete)
        }catch(e){
            next(e)
        }
    };

    async resetPassword(req,res,next){
        try{
            const { currentPassword, newPassword } = req.body;
            const refreshToken = req.cookies.refreshToken;

            if(!refreshToken){
                throw ApiError.UnauthorizedError()
            };

            const user = await tokenService.findUserByRefreshToken(refreshToken);
            const resetedPass = await profileService.resetPassword(user._id,currentPassword,newPassword);
            
            res.json(resetedPass);
        }catch(e){
            next(e)
        }
    };

    async changeStatus(req,res,next){
        try{
            const { status } = req.body;
            const refreshToken = req.cookies.refreshToken;

            if(!refreshToken){
                throw ApiError.UnauthorizedError()
            };

            const user = await tokenService.findUserByRefreshToken(refreshToken);

            const changedStat = await profileService.changeStatus(user._id,status);
            res.json(changedStat)
        }catch(e){
            next(e)
        }
    }

};

module.exports = new MgmtContoller()