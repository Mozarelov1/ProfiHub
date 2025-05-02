require('dotenv').config()
const {S3Client,DeleteObjectCommand } = require('@aws-sdk/client-s3');
const ApiError = require('../auth/exceptions/api-errors');
const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const s3Client = new S3Client({
    region:process.env.AWS_REGION,
    credentials:{
        accessKeyId:process.env.AWS_ACCESS_KEY_ID ,
        secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY
    }
});

const upload = multer({
  storage:multerS3({
    s3:s3Client,
    bucket:process.env.AWS_BUCKET,
    acl:"public-read",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function(req,file,cb){
      const ext = path.extname(file.originalname);
      const filename = `${uuidv4()}${ext}`;
      cb(null, filename);
    }
  }),
  limits: { fileSize: 10 * 1024 * 1024 }    
});

  function parseS3Url(fileUrl){
    const {hostname,pathname} = new URL(fileUrl);

    const bucket = hostname.split('.')[0];
    const key = decodeURIComponent(pathname.slice(1));

    return {bucket,key}
  };


async function deleteFile(url){
    const {bucket,key} = parseS3Url(url);
    try{
      await s3Client.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
      return { success: true };
    }catch(e){
      throw ApiError.BadRequest('url required');
    }
}

module.exports = {
  upload,
  deleteFile
};