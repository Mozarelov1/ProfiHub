const UserModel = require('../models/user-model');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const mailService = require('./mail-service');
const tokenService = require('./token-service');
const UserDto = require('../dtos/user-dto')
const ApiError = require('../exceptions/api-errors');
const UserInfoModel = require('../../account-management/models/userInfo-model')

class UserService{
    async registration(email,password,login){
        const candidate = await UserModel.findOne({email});
        if (candidate){
            throw ApiError.BadRequest('user already exists')
        };
        const hashedPassword = await bcrypt.hash(password,3);
        const activationLink = uuid.v4();
        const link = uuid.v4();
        const user = await UserModel.create({email,password: hashedPassword,login,activationLink});
        const userInfo = await UserInfoModel.create({user: user._id,email,link});
        await mailService.sendActivationMail(email,`http://localhost:2000/api/auth/activate/${activationLink}`);

        const userDto = new UserDto(user)
        const tokens = tokenService.generateTokens({...userDto});

        await tokenService.saveToken(userDto.id,tokens.refreshToken);

        return{
            ...tokens,
            user:userDto
        }
    }
    async activate(activationLink){
            const user = await UserModel.findOne({activationLink});
            if(!user){
                throw ApiError.BadRequest("invalid link")
            };
            user.isActivated = true;
            await user.save();
    };
    async login(email,password){
        const user = await UserModel.findOne({email});

        if(!user){
            throw ApiError.BadRequest("user not found")
        };

        const isPassEquals = await bcrypt.compare(password,user.password);

        if(!isPassEquals){
            throw ApiError.BadRequest("wrong password")
        };

        const userDto = new UserDto(user)
        const tokens = tokenService.generateTokens({...userDto});

        await tokenService.saveToken(userDto.id,tokens.refreshToken);

        return{
            ...tokens,
            user:userDto
        }
    };
    async logout(refreshToken){
        const token = await tokenService.removeToken(refreshToken);
        return token;
    };

    async refresh(refreshToken){
        if(!refreshToken){
            throw ApiError.UnauthorizedError()
        };

        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDB = tokenService.findToken(refreshToken);

        if(!userData || !tokenFromDB){
            throw ApiError.UnauthorizedError()
        };
        const user = await UserModel.findById(userData.id)
        const userDto = new UserDto(user)
        const tokens = tokenService.generateTokens({...userDto});

        await tokenService.saveToken(userDto.id,tokens.refreshToken);

        return{
            ...tokens,
            user:userDto
        }
    };
};


module.exports = new UserService();