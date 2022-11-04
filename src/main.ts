import {
  ValidationPipe,
  HttpStatus,
  UnprocessableEntityException,
} from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import * as requestIp from 'request-ip'

import { AppModule } from './app.module'
import { ResponseInterceptor } from './interceptors/response.interceptor'
import { LoggerMiddleware } from './common/middlewares/logger.middlewares'
import { LoggerConfig } from './common/configs/logger.config'

import { SharedModule } from './shared/shared.module'
import { EnvService } from './shared/service/env.service'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // 全局前缀
  app.setGlobalPrefix('api')

  // 静态文件
  // app.use('/static', serveStatic(join(__dirname, '../static')))

  // 请求IP
  app.use(requestIp.mw())

  // 请求参数校验
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      dismissDefaultMessages: true,
      exceptionFactory: (errors) => new UnprocessableEntityException(errors),
    }),
  )

  // app.useGlobalFilters(new HttpExceptionsFilter()) // 统一错误处理

  // response格式化封装
  app.useGlobalInterceptors(new ResponseInterceptor())

  // 打印请求日志
  app.use(LoggerMiddleware)

  // 日志配置
  LoggerConfig()

  // 跨域配置 CORS
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: '*',
  })

  // 启动配置
  const envService = app.select(SharedModule).get(EnvService)

  // 启动端口
  const port = envService.appConfig.port
  await app.listen(port)

  console.info(`server running on ${await app.getUrl()}`)
}

bootstrap()
