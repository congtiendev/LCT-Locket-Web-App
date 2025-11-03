module.exports = {
  driver: process.env.STORAGE_DRIVER || 'local',
  uploadPath: process.env.UPLOAD_PATH || './uploads',
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    bucket: process.env.AWS_BUCKET_NAME,
  },
};
