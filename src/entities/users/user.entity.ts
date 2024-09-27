import { Column, Entity, OneToMany } from 'typeorm';
import { BaseAuthenticatableModel } from '../../lib/entities/authenticatable.entity';
import { AccessToken } from '../access-token/access-token.entity';
import { Listing } from '../../modules/listings/listings.entity'; // Assuming listings entity exists

@Entity({ name: 'users' })
export class User extends BaseAuthenticatableModel {
  @Column({ type: 'varchar', length: 255 })
  full_name: string;

  @Column({ type: 'date' })
  birth_date: Date;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone_number: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  address: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  city: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  country: string;

  @OneToMany(() => AccessToken, (accessToken: AccessToken) => accessToken.user)
  access_tokens: AccessToken[];

  // Assuming the user can have multiple listings
  @OneToMany(() => Listing, (listing: Listing) => listing.owner)
  listings: Listing[];
}
