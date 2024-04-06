// import { Injectable, InternalServerErrorException } from "@nestjs/common";
// import { MFile } from "./mfile.class";
// import { join } from "path";
// import {access,  mkdir, writeFile } from "fs/promises";
// import * as sharp from "sharp";
// import { FileResponse } from "./file.interface";
// import { v4 } from "uuid";

// @Injectable()
// export class FileService{
//     async saveFiles(files: MFile[], folder = "default"){
//         const uploadFolder = join(__dirname, '..','..', 'static', folder);

//         try{
//             await access(uploadFolder);
//         } catch(e){
//             await mkdir(uploadFolder, {recursive: true});
//         }

//         const res: FileResponse[] = await Promise.all(
//             files.map(async (file): Promise<FileResponse> =>{
//                 try{
//                     await writeFile(join(uploadFolder, file.originalname), file.buffer)
//                 } catch(e){
//                     throw new InternalServerErrorException("Ошибка при записи файлов")
//                 }
//                 return {
//                     url: `/static/${folder}/${file.originalname}`,
//                     name: file.originalname
//                 }
//             })
//         );
//         return res
//     }

//     convertToWebP(file: Buffer): Promise<Buffer>{
//         return sharp(file).webp().toBuffer()
//     }

//     async filterFiles(files: MFile[]){
//         if (!files || files.length === 0) {
//             throw new Error("Массив файлов пуст или не определен");
//         }
        
//         const newFiles = await Promise.all(
//             files.map(async file => {
//                 const mimetype = file.mimetype;
//                 const currentFileType = file.mimetype.split('/')[1];
//                 const newName = v4();
//                 const type =file.originalname.split(".")[1];

//                 if(mimetype.includes('image')){
//                     if(currentFileType != 'svg+xml'){
//                         const buffer = await this.convertToWebP(file.buffer);
//                         return new MFile({
//                             buffer, 
//                             originalname: `${newName}.webp`,
//                             mimetype,
//                         });
//                     }
//                     return new MFile({
//                         buffer: file.buffer,
//                         originalname: `${newName}.svg`,
//                         mimetype
//                     });
//                 }
//                 return new MFile({
//                     buffer: file.buffer,
//                     originalname: `${newName}.${type}`,
//                     mimetype
//                 });
//             })
//         );
//         return newFiles;
//     }
// }