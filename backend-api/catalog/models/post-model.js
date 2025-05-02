const {Schema,model} = require('mongoose');

const PostSchema = new Schema({
    author:{type:Schema.Types.ObjectId,ref:'User',required:true},
    titlе:{type:String,required:true},
    experience:{type:String,required:true},
    category:{type:String,required:true,enum: ["Frontend","Backend","Quality-Assurance","Artificial-Intelligence","Mobile","DevOps","GameDev","Hardware","Artist"]},
    description:{type:String},
    salary:{type:String},
    link:{type:String,required:true}
},{ timestamps: true });

module.exports = model('Post',PostSchema);