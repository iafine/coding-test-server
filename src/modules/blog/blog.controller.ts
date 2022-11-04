import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Req,
  DefaultValuePipe,
  Param,
  Body,
  ParseIntPipe,
  Query,
} from '@nestjs/common'
import { Blog } from './entity/blog.entity'
import { BlogService } from './blog.service'
import { Pagination } from 'nestjs-typeorm-paginate'

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get('')
  async getBlogList(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 5,
  ): Promise<Pagination<Blog>> {
    limit = limit > 100 ? 100 : limit
    return this.blogService.getBlogList({ page, limit })
  }

  @Post('')
  async createBlog(@Req() req) {
    const { body = {} } = req
    const res = await this.blogService.createBlog(body)
    return res
  }

  @Get(':id')
  async getBlog(@Param('id') id: string) {
    const res = await this.blogService.getBlogInfo(id)
    return res
  }

  @Put(':id')
  async updateBlog(@Param('id') id: string, @Req() req) {
    const { body = {} } = req
    const res = await this.blogService.updateBlogById(id, body)
    return res
  }

  @Delete(':id')
  async deleteBlog(@Param('id') id: string) {
    const res = await this.blogService.deleteBlog(id)
    return res
  }
}
