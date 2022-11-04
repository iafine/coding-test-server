import { Entity, Column } from 'typeorm'
import { BaseEntity } from '../../../common/entity/base.entity'

@Entity('blog')
export class Blog extends BaseEntity {
  @Column({ comment: '标题', unique: true })
  title: string

  @Column({ comment: '文章内容', nullable: true })
  content: string
}
