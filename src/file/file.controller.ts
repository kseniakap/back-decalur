// import { Controller, HttpCode, Post, Query, UploadedFile, UseInterceptors } from "@nestjs/common";
// import { FilesInterceptor } from "@nestjs/platform-express";
// import { FileService } from "./file.service";

// @Controller('file')
// export class FileController{
//     constructor(private readonly fileService: FileService){}

//     @Post()
//     @HttpCode(200)
//     @UseInterceptors(FilesInterceptor("file"))
//     async uploadFile(
//         @UploadedFile() files: Express.Multer.File[],
//         @Query("folder") folder?: string
//     ){
//         const newFiles = await this.fileService.filterFiles(files);
//         return this.fileService.saveFiles(newFiles, folder)
//     }
// }