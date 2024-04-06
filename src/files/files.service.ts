import { Injectable } from '@nestjs/common';
import * as sharp from "sharp";
import * as fs from 'fs';

@Injectable()
export class FilesService {
  async convertToWebP(files: any[]): Promise<string[]> {
    const fileLinks: string[] = [];

    for (const file of files) {
      const webpFileName = file.filename.replace(/\.[^.]+$/, '.webp');
      await sharp(file.path).webp({ quality: 65 }).toFile(`./uploads/${webpFileName}`);
      fileLinks.push(`${webpFileName}`);
    }
    return fileLinks;
  }

  async deleteImage(fileName: string): Promise<void> {
    const imagePath = `./uploads/${fileName}`;
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  } 
}
