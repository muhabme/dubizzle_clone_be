import {
  CopyObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import {
  StorageDisk,
  type DiskStorageContract,
  type IMetadata,
  type PreSignedUrl,
  type PreSignedUrlOptions,
} from '../contracts/storage.disk.contract';

@Injectable()
export class S3DiskStorage implements DiskStorageContract {
  readonly name = StorageDisk.S3;

  private readonly client: S3Client;

  private options: {
    region: string;
    bucket: string;
    preSignedUrlExpiresIn: number;
  };

  constructor(private readonly configService: ConfigService) {
    this.setupOptions();
    this.client = this.createClient();
  }

  async createPreSignedUrl(
    options: PreSignedUrlOptions,
  ): Promise<PreSignedUrl> {
    const preSignedUrlOptions = {
      Bucket: this.options.bucket,
      Key: options.key,
      conditions: [
        { bucket: this.options.bucket },
        { acl: 'private' },
        ['starts-with', '$key', options.key],
      ],
      Expires: options.expiresInSeconds ?? this.options.preSignedUrlExpiresIn,
      Fields: { 'content-type': options.mimeType as string },
    };

    const { url, fields } = await createPresignedPost(
      this.client,
      preSignedUrlOptions,
    );

    return { url, fields };
  }

  async exists(key: string): Promise<false | IMetadata> {
    try {
      return await this.info(key);
    } catch {
      return false;
    }
  }

  async info(key: string): Promise<IMetadata> {
    try {
      const command = new HeadObjectCommand({
        Bucket: this.options.bucket,
        Key: key,
      });

      const info = await this.client.send(command);

      return {
        contentType: info.ContentType,
        contentLength: info.ContentLength,
      };
    } catch {
      throw new HttpException('File Not Found', HttpStatus.NOT_FOUND);
    }
  }

  async copy(
    sourceKey: string,
    destinationKey: string,
    metadata: IMetadata,
  ): Promise<void> {
    const command = new CopyObjectCommand({
      Bucket: this.options.bucket,
      CopySource: `${this.options.bucket}/${sourceKey}`,
      Key: destinationKey,
      ContentType: metadata.contentType,
      MetadataDirective: 'REPLACE',
    });

    await this.client.send(command);
  }

  async delete(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.options.bucket,
      Key: key,
    });

    await this.client.send(command);
  }

  async upload(
    buffer: Buffer,
    key: string,
    contentType: string,
  ): Promise<void> {
    const command = new PutObjectCommand({
      Bucket: this.options.bucket,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    });

    await this.client.send(command);
  }

  async move(
    sourceKey: string,
    destinationKey: string,
    metadata: IMetadata,
  ): Promise<void> {
    await this.copy(sourceKey, destinationKey, metadata);
    await this.delete(sourceKey);
  }

  private formatS3Url(key: string): string {
    return `https://${this.options.bucket}.s3.${this.options.region}.amazonaws.com/${key}`;
  }

  private createClient() {
    return new S3Client({
      credentials: {
        accessKeyId: this.configService.getOrThrow('AWS_S3_ACCESS_KEY'),
        secretAccessKey: this.configService.getOrThrow(
          'AWS_S3_SECRET_ACCESS_KEY',
        ),
      },
      region: this.options.region,
    });
  }

  private setupOptions() {
    this.options = {
      region: this.configService.getOrThrow('AWS_S3_REGION'),
      bucket: this.configService.getOrThrow('AWS_S3_BUCKET'),
      preSignedUrlExpiresIn: this.configService.getOrThrow(
        'AWS_S3_PRESIGNED_URL_EXPIRES_IN_SECONDS',
      ),
    };
  }
}
