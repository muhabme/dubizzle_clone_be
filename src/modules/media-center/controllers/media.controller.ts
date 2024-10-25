import { lowerCase } from 'lodash';

import type { ItemResponse } from '@lib/responses/response.type';
import { Body, Controller, Post, UseGuards, UsePipes } from '@nestjs/common';

import { User } from 'src/entities/users/user.entity';
import { CurrentUser } from 'src/lib/decorators/user.decorator';
import { ValidationPipe } from 'src/lib/pipes/validation.pipe';
import { AdminsOrUsers } from 'src/modules/auth/passport/guards/admins-or-users.guard';
import { MediaManager } from '../managers/media.manager';
import { GenerateUploadLinkRequest } from '../requests/generate-upload-link.request';
import type { MediaResponse } from '../responses/media.response';
import { PreSignedUrlResponse } from '../responses/pre-signed-url.response';

@Controller('media')
@UsePipes(new ValidationPipe())
@UseGuards(AdminsOrUsers)
export class MediaController {
  constructor(private readonly mediaManager: MediaManager) {}

  @Post('pre-signed-url')
  async preSignedUrl(
    @CurrentUser() user: User,
    @Body() request: GenerateUploadLinkRequest,
  ): Promise<ItemResponse<MediaResponse>> {
    const builder = await this.mediaManager.builderOf(request.mime_type);

    const preSignedUrl = await builder.preSignedUrl({
      ...request,
      uploader_id: user.id,
      uploader_type: lowerCase(user.constructor.name),
    });

    return new PreSignedUrlResponse().json({
      data: preSignedUrl,
    }) as ItemResponse<MediaResponse>;
  }
}
