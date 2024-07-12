import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';


@Entity()
export class Token {
  @PrimaryGeneratedColumn()
  id: number=0;

  @Column()
  accessToken: string='';

  @Column()
  refreshToken: string='';

  @Column('bigint')
  tokenExpiresAt: number=0;

  @CreateDateColumn()
  createdAt: Date= new Date();
}
