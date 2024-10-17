export enum StorageDisk {
  S3 = 's3',
}

export interface PreSignedUrl {
  url: string;
  fields: Record<string, string>;
}

export interface PreSignedUrlOptions {
  key: string;
  mimeType?: string;
  expiresInSeconds?: number;
}

export interface IMetadata {
  contentType?: string;
  contentLength?: number;
}

export interface DiskStorageContract {
  readonly name: StorageDisk;
  createPreSignedUrl(options: PreSignedUrlOptions): Promise<PreSignedUrl>;
  info(key: string): Promise<IMetadata>;
  upload(buffer: Buffer, key: string, contentType: string): Promise<void>;
  move(
    sourceKey: string,
    destinationKey: string,
    metadata: IMetadata,
  ): Promise<void>;
  copy(
    sourceKey: string,
    destinationKey: string,
    metadata: IMetadata,
  ): Promise<void>;
  delete(key: string): Promise<void>;
  exists(key: string): Promise<false | IMetadata>;
}
