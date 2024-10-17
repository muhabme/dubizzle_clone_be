import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';

import { camelCase } from 'lodash';
import { toBoolean } from '../../helpers/boolean';
import {
  StorageDisk,
  type DiskStorageContract,
} from '../contracts/storage.disk.contract';
import { S3DiskStorage } from '../disks/s3.disk';

@Injectable()
export class DiskStorageManager {
  private readonly disksMapper: Partial<
    Record<StorageDisk, DiskStorageContract>
  > = {
    [StorageDisk.S3]: S3DiskStorage as unknown as DiskStorageContract,
  };

  constructor(private moduleRef: ModuleRef) {}

  async diskOf(name: StorageDisk): Promise<DiskStorageContract> {
    const diskClass: typeof S3DiskStorage | undefined =
      this.disksMapper[camelCase(name)];

    if (!toBoolean(diskClass)) {
      throw new HttpException('Invalid Storage Disk', HttpStatus.FORBIDDEN);
    }

    return this.moduleRef.resolve(diskClass!);
  }
}
