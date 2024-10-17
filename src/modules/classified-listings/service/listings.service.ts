import { Injectable, NotFoundException } from '@nestjs/common';
import { Media } from 'src/entities/media-center/media.entity';
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
    super(Listing);
  }

  async createListing(createListingDto: CreateListingDto): Promise<Listing> {
    const { categoryId, ownerId, ...listingData } = createListingDto;

    const category = await this.categoriesService.findOneById({
      id: categoryId,
    });
    if (!category) {
      throw new NotFoundException(`Category with ID ${categoryId} not found`);
    }

    const owner = await this.usersService.findOneById({ id: ownerId });
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

  async findAllListings(): Promise<Listing[]> {
    return await this.findAll({
      relations: ['category', 'owner', 'promotion'],
    });
  }

  async findOneListing(id: number): Promise<Listing | undefined> {
    return await this.findOne({
      where: { id },
      relations: ['category', 'owner', 'promotion'],
    });
  }

  async deleteListing(id: number): Promise<void> {
    const listing = await this.findOneById({ id });

    if (!listing) {
      throw new NotFoundException(`Listing with ID ${id} not found`);
    }

    await listing.remove();
  }
}
