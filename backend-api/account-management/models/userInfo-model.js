const {Schema,model} = require('mongoose');

const UserInfoSchema = new Schema({
    user:{type:Schema.Types.ObjectId,ref:'User',required:true},
    avatar:{type:String,required: true,default: process.env.DEFAULT_AVATAR},
    bio:{type:String},
    hired:{type:Boolean},
    email:{type:String},
    link:{type:String,required:true}
});

module.exports = model('UserInfo',UserInfoSchema);