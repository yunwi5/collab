import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { S3Service } from './s3.service';
import { S3Controller } from './s3.controller';
import { getMulterDest } from './util';

@Module({
  imports: [
    MulterModule.register({
      dest: getMulterDest(),
    }),
  ],
  controllers: [S3Controller],
  providers: [S3Service],
})
export class S3Module {}
