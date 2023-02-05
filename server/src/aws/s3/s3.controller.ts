import {
  Controller,
  Get,
  Post,
  Param,
  UseInterceptors,
  UploadedFile,
  InternalServerErrorException,
  Res,
  Delete,
} from '@nestjs/common';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { getErrorMessage } from 'src/utils/error.util';
import { getLogger } from 'src/config/logger.config';
import { S3Service } from './s3.service';

const IMAGE_SIZE_LIMIT = 5_242_880;

@Controller('s3')
export class S3Controller {
  private readonly logger = getLogger(S3Controller.name);

  constructor(private readonly s3Service: S3Service) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', { limits: { fileSize: IMAGE_SIZE_LIMIT } }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    try {
      const result = await this.s3Service.uploadImage(file);
      this.logger.info('image uploaded successfully; result: %s;', result);
      await this.s3Service.deleteLocalUpload(file.path);
      return { srcKey: result.Key, url: result.Location };
    } catch (err) {
      this.logger.error(
        'could not uplaod an image; err: %s',
        getErrorMessage(err),
      );
      throw new InternalServerErrorException('Could not upload an image');
    }
  }

  @Get(':key')
  findOne(@Param('key') key: string, @Res() res: Response) {
    const readStream = this.s3Service.findAsReadStream(key);
    readStream.on('error', () => {
      this.logger.warn('could not find the image; key: %s;', key);
      return res.status(200).send('Image unavailable');
    });

    return readStream.pipe(res);
  }

  @Delete(':key')
  async deleteOne(@Param('key') key: string) {
    try {
      await this.s3Service.deleteImage(key);
    } catch (err) {
      this.logger.error(
        'could not delete the image; err: %s',
        getErrorMessage(err),
      );
      throw new InternalServerErrorException('Could not delete an image');
    }
  }
}
