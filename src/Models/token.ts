import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm";

@Entity()
export class AccessToken {
  @PrimaryGeneratedColumn()
  id: number ;

  @Column()
  access_token: string ;

  @Column()
  refresh_token: string ;

  @Column('bigint')
  expires_in: number ;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date ; 
}
