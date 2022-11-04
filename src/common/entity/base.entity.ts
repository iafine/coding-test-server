import {
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
} from 'typeorm'
import { dateTransformer } from './transform'

/**
 * 公用实体
 * 一条数据必须存在的属性
 */
export class BaseEntity {
  @PrimaryColumn({ comment: 'ID' })
  id: string

  @CreateDateColumn({ comment: '创建时间', transformer: dateTransformer })
  createdAt: Date

  @UpdateDateColumn({ comment: '更新时间', transformer: dateTransformer })
  updatedAt: Date

  @Column({ type: Boolean, default: false })
  isDisabled: boolean
}
