import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Listing } from '../../../entities/listing/listings.entity';
import { CreateListingDto } from '../dtos/create-listing.dto';
import { CrudService } from 'src/lib/services/crud.service';
import { Category } from '../../../entities/categories/category.entity';
import { User } from '../../../entities/users/user.entity';

@Injectable()
export class ListingsService extends CrudService<Listing> {
  constructor(
    @InjectRepository(Listing)
    private readonly listingsRepository: Repository<Listing>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super(listingsRepository);
  }

  async createListing(createListingDto: CreateListingDto): Promise<Listing> {
    const { categoryId, ownerId, ...listingData } = createListingDto;

    const category = await this.categoryRepository.findOne({ where: { id: categoryId } });
    if (!category) {
      throw new NotFoundException(`Category with ID ${categoryId} not found`);
    }

    const owner = await this.userRepository.findOne({ where: { id: ownerId } });
    if (!owner) {
      throw new NotFoundException(`User with ID ${ownerId} not found`);
    }

    const listing = this.listingsRepository.create({
      ...listingData,
      category,
      owner,
    });

    return await this.listingsRepository.save(listing);
  }

  async findAllListings(): Promise<Listing[]> {
    return await this.listingsRepository.find({ relations: ['category', 'owner', 'promotion'] });
  }

  async findOneListing(id: number): Promise<Listing | undefined> {
    return await this.listingsRepository.findOne({
      where: { id },
      relations: ['category', 'owner', 'promotion'],
    });
  }

  async deleteListing(id: number): Promise<void> {
    const result = await this.listingsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Listing with ID ${id} not found`);
    }
  }
}
