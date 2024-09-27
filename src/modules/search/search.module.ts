import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { Listing } from '../listings/listings.entity';

/**
 * Module for managing search and filtering listings.
 */
@Module({
  imports: [TypeOrmModule.forFeature([Listing])],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
