import { Injectable } from '@nestjs/common';
import fs from 'fs';
import util from 'util';
import aws from 'aws-sdk';
import { envConfig } from 'src/config/env.config';

const unlinkFile = util.promisify(fs.unlink);

@Injectable()
export class S3Service {
  private s3: aws.S3;

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

  async upload(file: Express.Multer.File) {
    const fileStream = fs.createReadStream(file.path);

    const params = {
      Bucket: envConfig.ImageBucketName,
      Body: fileStream,
      Key: file.filename,
    };

    return this.s3.upload(params).promise();
  }

  findAsReadStream(fileKey: string) {
    const downloadParams = {
      Key: fileKey,
      Bucket: envConfig.ImageBucketName,
    };

    return this.s3.getObject(downloadParams).createReadStream();
  }
}
