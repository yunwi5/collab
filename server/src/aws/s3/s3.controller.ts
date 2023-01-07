import {
  Controller,
  Get,
  Post,
  Param,
  UseInterceptors,
  UploadedFile,
  InternalServerErrorException,
  Res,
} from '@nestjs/common';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { getErrorMessage } from 'src/utils/error.util';
import { S3Service } from './s3.service';

const IMAGE_SIZE_LIMIT = 5242880;

@Controller('s3')
export class S3Controller {
  constructor(private readonly s3Service: S3Service) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', { limits: { fileSize: IMAGE_SIZE_LIMIT } }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
    try {
      const result = await this.s3Service.upload(file);
      console.log(result);
      await this.s3Service.deleteLocalUpload(file.path);
      return { srcKey: result.Key, url: result.Location };
    } catch (err) {
      throw new InternalServerErrorException(getErrorMessage(err));
    }
  }

  @Get(':key')
  findOne(@Param('key') key: string, @Res() res: Response) {
    const readStream = this.s3Service.findAsReadStream(key);
    readStream.on('error', () => {
      return res.status(200).send('Image unavailable');
    });

    return readStream.pipe(res);
  }
}
