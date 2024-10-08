import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { AccessToken } from '../access-token/access-token.entity';
import { BaseAuthenticatableModel } from '../../lib/entities/authenticatable.entity';
import { Listing } from '../listing/listings.entity';

@Entity({ name: 'users' })
export class User extends BaseAuthenticatableModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'boolean', default: false })
  isBlocked: boolean;

  @Column({ type: 'date' })
  birth_date: Date;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone_number: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  address: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  city: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  country: string;

  @Column({ type: 'varchar', nullable: true })
  resetToken?: string;

  @OneToMany(() => AccessToken, (accessToken: AccessToken) => accessToken.user)
  access_tokens: AccessToken[];

  @OneToMany(() => Listing, (listing) => listing.owner)
  listings: Listing[];
}