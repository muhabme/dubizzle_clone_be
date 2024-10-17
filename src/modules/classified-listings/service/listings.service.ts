import { Injectable, NotFoundException } from '@nestjs/common';
import { Media } from 'src/entities/media-center/media.entity';
import {
  dateRangeFilter,
  exactFilter,
  partialFilter,
  searchFilter,
} from 'src/lib/query-builder/filters';
import { ItemQueryBuilder } from 'src/lib/query-builder/item-query-builder';
import { ListQueryBuilder } from 'src/lib/query-builder/list-query-builder';
import { CrudService } from 'src/lib/services/crud.service';
import { CategoriesService } from 'src/modules/categories/services/categories.service';
import { AttachmentsService } from 'src/modules/media-center/services/attachments.service';
import { UsersService } from 'src/modules/users/services/users.service';
import { Listing } from '../../../entities/listing/listings.entity';
import { CreateListingDto } from '../dtos/create-listing.dto';

const ATTACHMENTS_FOLDER = 'attachments/listings';

@Injectable()
export class ListingsService extends CrudService<Listing> {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly usersService: UsersService,
    private readonly attachmentsService: AttachmentsService,
  ) {
    const listQueryBuilder: ListQueryBuilder<Listing> = new ListQueryBuilder();
    const itemQueryBuilder: ItemQueryBuilder<Listing> = new ItemQueryBuilder();

    super({
      defaults: {
        findOptions: {
          order: { updated_at: 'desc' },
          relations: ['category', 'images', 'owner'],
        },
      },
      entity: Listing,
      listQueryBuilder: listQueryBuilder.setOptions({
        allowedSorts: ['created_at', 'updated_at'],
        allowedFilters: [
          partialFilter('title'),
          exactFilter('category'),
          searchFilter(['title']),
          dateRangeFilter('created_at'),
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

  async createListing(createListingDto: CreateListingDto): Promise<Listing> {
    const { categoryId, ownerId, ...listingData } = createListingDto;

    const category = await this.categoriesService.first({
      id: categoryId,
    });
    if (!category) {
      throw new NotFoundException(`Category with ID ${categoryId} not found`);
    }

    const owner = await this.usersService.first({ id: ownerId });
    if (!owner) {
      throw new NotFoundException(`User with ID ${ownerId} not found`);
    }

    const images = await this.attachmentsService.validateAndMapTo(
      ATTACHMENTS_FOLDER,
      listingData.images as unknown as Media[],
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
        items: listingData.images as unknown as Media[],
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
