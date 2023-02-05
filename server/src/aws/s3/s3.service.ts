import { Injectable } from '@nestjs/common';
import fs from 'fs';
import util from 'util';
import aws from 'aws-sdk';
import { envConfig } from 'src/config/env.config';
import { getLogger } from 'src/config/logger.config';

const unlinkFile = util.promisify(fs.unlink);

@Injectable()
export class S3Service {
  private readonly logger = getLogger(S3Service.name);

  private readonly s3: aws.S3;

  constructor() {
    this.s3 = new aws.S3({
      region: envConfig.AwsRegion,
      accessKeyId: envConfig.AwsAccessKeyId,
      secretAccessKey: envConfig.AwsAccessSecret,
      signatureVersion: 'v4',
    });
  }

  async deleteLocalUpload(path: string) {
    await unlinkFile(path);
  }

  async uploadImage(file: Express.Multer.File) {
    const fileStream = fs.createReadStream(file.path);

    const params = {
      Bucket: envConfig.ImageBucketName,
      Body: fileStream,
      Key: file.filename,
    };

    this.logger.info('upload image; params: %s;', params);

    return this.s3.upload(params).promise();
  }

  findAsReadStream(imageKey: string) {
    const downloadParams = {
      Key: imageKey,
      Bucket: envConfig.ImageBucketName,
    };

    return this.s3.getObject(downloadParams).createReadStream();
  }

  async deleteImage(imageKey: string) {
    const params = {
      Bucket: envConfig.ImageBucketName,
      Key: imageKey,
    };

    this.logger.info('delete image; params: %s;', params);

    return this.s3.deleteObject(params).promise();
  }
}
