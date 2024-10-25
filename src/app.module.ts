import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { configModuleSetupOptions } from './config/config-module-options';
import { typeOrmModuleOptions } from './config/typeorm-module-options';
import { AdminModule } from './modules/admin/admin.module';
import { AuthModule } from './modules/auth/auth.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { ListingsModule } from './modules/classified-listings/listings.module';
import { FavoritesModule } from './modules/favorite/favorites.module';
import { MediaCenterModule } from './modules/media-center/media-center.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot(configModuleSetupOptions),
    TypeOrmModule.forRootAsync(typeOrmModuleOptions),
    AuthModule,
    AdminModule,
    UsersModule,
    CategoriesModule,
    ListingsModule,
    FavoritesModule,
    MediaCenterModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
