 import { Controller, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { FilesService } from './files.service'
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: diskStorage({
        filename: (req, file, cb) => {
          const randomName = Array(10)
            .fill(null)
            .map(() => (Math.round(Math.random() * 16)).toString(16))
            .join('');
          return cb(null, `decalur_${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async uploadMultiple(@UploadedFiles() files) {
    const fileLinks = await this.filesService.convertToWebP(files); 
    return fileLinks;
  }
}
