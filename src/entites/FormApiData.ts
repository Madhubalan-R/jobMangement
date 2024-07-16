import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export enum FormStatus{
  ADDED = 'Added',
  IN_PROGRESS = 'In_progress',
  FAILED = 'Failed',
  RETRY = 'Retry',
  COMPLETED = 'Completed',
 }

@Entity()
export class FormApiData {
  @PrimaryGeneratedColumn()
  id: number=0;

  @Column('bigint')
  componentId: number=0;

  @Column()
  formLinkName: string='';

  @Column()
  PermissionDetails: string='';

  @Column({
    type:'enum',
    enum:FormStatus,
    default: FormStatus.ADDED,
  })
  status: FormStatus = FormStatus.ADDED;

  @Column({default: 0})
  retryCount: number=0;
  
  @CreateDateColumn()
  createdAt: Date= new Date();
}
