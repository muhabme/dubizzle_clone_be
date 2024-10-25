import { Injectable, NotFoundException } from '@nestjs/common';
import { Media } from 'src/entities/media-center/media.entity';
import { User } from 'src/entities/users/user.entity';
import {
  dateRangeFilter,
  exactFilter,
  partialFilter,
  searchFilter,
} from 'src/lib/query-builder/filters';
import { priceRangeFilter } from 'src/lib/query-builder/filters/price-range.filter';
import { ItemQueryBuilder } from 'src/lib/query-builder/item-query-builder';
import { ListQueryBuilder } from 'src/lib/query-builder/list-query-builder';
import { CrudService } from 'src/lib/services/crud.service';
import { CategoriesService } from 'src/modules/categories/services/categories.service';
import { AttachmentsService } from 'src/modules/media-center/services/attachments.service';
import { MediaService } from 'src/modules/media-center/services/media.service';
import { UsersService } from 'src/modules/users/services/users.service';
import { Listing } from '../../../entities/listing/listings.entity';
import { CreateListingDto } from '../dtos/create-listing.dto';
import { isFeaturedListingFilter } from '../filters/is-featured-listing.filter';
import { isOnSaleFilter } from '../filters/is-on-sale.filter';

const ATTACHMENTS_FOLDER = 'attachments/listings';

@Injectable()
export class ListingsService extends CrudService<Listing> {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly usersService: UsersService,
    private readonly attachmentsService: AttachmentsService,
    private readonly mediaService: MediaService,
  ) {
    const listQueryBuilder: ListQueryBuilder<Listing> = new ListQueryBuilder();
    const itemQueryBuilder: ItemQueryBuilder<Listing> = new ItemQueryBuilder();

    super({
      defaults: {
        findOptions: {
          order: { updated_at: 'desc' },
          relations: { category: true, owner: true },
        },
      },
      entity: Listing,
      listQueryBuilder: listQueryBuilder.setOptions({
        allowedSorts: ['created_at', 'updated_at', 'price'],
        allowedFilters: [
          partialFilter('title'),
          exactFilter('category'),
          isOnSaleFilter(),
          isFeaturedListingFilter(),
          searchFilter(['title']),
          dateRangeFilter('created_at'),
          priceRangeFilter('price'),
        ],
        allowedIncludes: [],
        allowedIncludeCounts: [],
      }),
      itemQueryBuilder: itemQueryBuilder.setOptions({
        allowedIncludes: [],
        allowedIncludeCounts: [],
      }),
    });
  }

  async createListing(
    createListingDto: CreateListingDto,
    user: User,
  ): Promise<Listing> {
    const { category: categoryId, ...listingData } = createListingDto;

    const category = await this.categoriesService.first({
      uuid: categoryId,
    });
    if (!category) {
      throw new NotFoundException(`Category with ID ${categoryId} not found`);
    }

    const owner = await this.usersService.first({ id: user.id });
    if (!owner) {
      throw new NotFoundException(`User with ID ${user.id} not found`);
    }

    const media = await Promise.all(
      listingData.images.map(
        async (image) => await this.mediaService.first({ uuid: image }),
      ),
    );

    const images = await this.attachmentsService.validateAndMapTo(
      ATTACHMENTS_FOLDER,
      media as unknown as Media[],
    );

    const listing = await this.create({
      ...listingData,
      category,
      owner,
      images,
    });

    if (images) {
      await this.attachmentsService.saveToDestination({
        relatedModel: listing,
        items: media as unknown as Media[],
        folder: ATTACHMENTS_FOLDER,
      });
    }

    return listing;
  }

  async findOneListing(id: number): Promise<Listing | undefined> {
    return await this.findOne({
      where: { id },
      relations: ['category', 'owner', 'promotion'],
    });
  }

  async deleteListing(id: number): Promise<void> {
    const listing = await this.first({ id });

    if (!listing) {
      throw new NotFoundException(`Listing with ID ${id} not found`);
    }

    await listing.remove();
  }
}
