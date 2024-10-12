import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SearchController } from './controllers/search.controller';
import { SearchService } from './services/search.service';
import { Listing } from 'src/entities/listing/listings.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Listing])],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
