const AWS = require('aws-sdk');
const StorageInterface = require('./storage.interface');

class S3Storage extends StorageInterface {
  constructor() {
    super();
    this.s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });
    this.bucket = process.env.AWS_BUCKET_NAME;
  }

  async upload(file, filePath) {
    const params = {
      Bucket: this.bucket,
      Key: filePath,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    const result = await this.s3.upload(params).promise();
    return result.Location;
  }

  async delete(filePath) {
    const params = {
      Bucket: this.bucket,
      Key: filePath,
    };

    await this.s3.deleteObject(params).promise();
  }

  async get(filePath) {
    const params = {
      Bucket: this.bucket,
      Key: filePath,
    };

    const result = await this.s3.getObject(params).promise();
    return result.Body;
  }

  async exists(filePath) {
    try {
      const params = {
        Bucket: this.bucket,
        Key: filePath,
      };

      await this.s3.headObject(params).promise();
      return true;
    } catch {
      return false;
    }
  }
}

module.exports = new S3Storage();
