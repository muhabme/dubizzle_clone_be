import { StorageModule } from '@lib/storage/storage.module';
import { Module } from '@nestjs/common';

import { UsersModule } from '../users/users.module';
import { MediaBuilder } from './builders/media.builder';
import { MediaController } from './controllers/media.controller';
import { MediaManager } from './managers/media.manager';
import { AttachmentsService } from './services/attachments.service';
import { CSVsMediaService } from './services/csv.service';
import { ImagesService } from './services/images.service';
import { MediaService } from './services/media.service';
import { PdfsMediaService } from './services/pdfs-media.service';

@Module({
  imports: [StorageModule, UsersModule],
  controllers: [MediaController],
  providers: [
    MediaService,
    MediaManager,
    MediaBuilder,
    AttachmentsService,
    ImagesService,
    PdfsMediaService,
    CSVsMediaService,
  ],
  exports: [
    StorageModule,
    MediaService,
    MediaManager,
    AttachmentsService,
    ImagesService,
    PdfsMediaService,
    CSVsMediaService,
  ],
})
export class MediaCenterModule {}
