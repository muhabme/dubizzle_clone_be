import { Module } from '@nestjs/common';

import { DiskStorageManager } from './managers/storage-disk.manager';
import { S3DiskStorage } from './disks/s3.disk';
@Module({
  imports: [],
  providers: [DiskStorageManager, S3DiskStorage],
  controllers: [],
  exports: [DiskStorageManager],
})
export class StorageModule {}
