import { Injectable } from '@nestjs/common';
import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';
import * as streamifier from 'streamifier';


@Injectable()
export class CloudinaryService {
  uploadImage(file: Express.Multer.File, username : string): Promise<UploadApiResponse | undefined> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          public_id : `usuarios/${username}/avatar`,
          overwrite : true,
          invalidate : true,
          resource_type : 'image'
        },
        (error, result) => {
          if (error) reject(error);
          resolve(result);
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }
}
