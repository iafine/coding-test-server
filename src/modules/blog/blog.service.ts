import { BadRequestException } from '@nestjs/common'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Blog } from './entity/blog.entity'
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate'

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(Blog)
    private readonly blogRepo: Repository<Blog>,
  ) {}

  /**
   * 获取博客列表
   */
  async getBlogList(options: IPaginationOptions): Promise<Pagination<Blog>> {
    return paginate<Blog>(this.blogRepo, options)
  }

  /**
   * 根据条件查找博客
   */
  async findBlogByWhere(where) {
    const blog = await this.blogRepo.findOne({
      where: { ...where, isDisabled: false },
    })

    return blog
  }

  /**
   * 获取博客详情
   */
  async getBlogInfo(id) {
    const blog = await this.findBlogByWhere({ id })
    if (!blog) {
      throw new BadRequestException('Not Find Blog!')
    }

    return blog
  }

  /**
   * 创建博客
   */
  async createBlog(blogInfo) {
    const { title, content } = blogInfo
    // 查找是否已经存在该标题
    const existBlog = await this.findBlogByWhere({ title })
    if (existBlog) {
      throw new BadRequestException('Has Exist Blog!')
    }

    const blog = new Blog()
    blog.title = title
    blog.content = content

    const res = await this.blogRepo.save(blog)
    return await this.findBlogByWhere({ id: res.id })
  }

  /**
   * 更新博客信息
   */
  async updateBlogById(id, updateInfo) {
    const existBlog = await this.findBlogByWhere({ id })

    if (!existBlog) {
      throw new BadRequestException('Not Find Blog!')
    }

    const blog = await this.blogRepo.save({ ...existBlog, ...updateInfo })
    return blog
  }

  /**
   * 删除博客
   */
  async deleteBlog(id) {
    const existBlog = await this.findBlogByWhere({ id })

    if (!existBlog) {
      throw new BadRequestException('Not Find Blog!')
    }

    const blog = await this.updateBlogById(id, { isDisabled: true })
    return blog
  }
}
