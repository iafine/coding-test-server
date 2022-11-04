import { Injectable } from '@nestjs/common'

@Injectable()
export class AppService {
  getHello(): any {
    return {
      data: {},
      message: 'Hello World!',
      code: 0,
    }
  }
}
