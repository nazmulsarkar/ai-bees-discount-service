import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { v4 as uuid } from 'uuid';
import { DeleteFileDTO } from '../dto/delete-file.dto';
import { UploadFileDTO } from '../dto/upload-file.dto';

@Injectable()
export class StorageService {
  private readonly s3: S3;
  private readonly bucket: string;

  constructor(private readonly configService: ConfigService) {
    this.s3 = new S3({
      region: this.configService.get('AWS_REGION'),
    });
    this.bucket = this.configService.get('AWS_PRIVATE_BUCKET_NAME');
  }

  public async generatePreSignedUrl(key: string) {
    return await this.s3.getSignedUrlPromise('getObject', {
      Bucket: this.bucket,
      Key: key,
    });
  }

  public async uploadFile(dataBuffer: Buffer, fileName?: string) {
    const s3 = new S3();
    const uploadResult = await s3
      .upload({
        Bucket: this.bucket,
        Body: dataBuffer,
        Key: `${uuid()}-${fileName}`,
      })
      .promise();
    return uploadResult;
  }

  public async uploadMultipleFile(files: UploadFileDTO[]) {
    return await Promise.all(
      files.map((item) => {
        const params = {
          Bucket: this.bucket,
          Key: `${uuid()}-${item.fileName}`,
          Body: item.file,
        };
        return this.s3.upload(params).promise();
      }),
    );
  }

  public async deleteFile(fileKey: string) {
    const params = new DeleteFileDTO();
    params.Key = fileKey;
    params.Bucket = this.bucket;
    return await this.s3.deleteObject(params).promise();
  }
}
