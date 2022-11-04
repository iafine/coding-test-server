import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { SharedModule } from './shared/shared.module'
import { EnvService } from './shared/service/env.service'
import { BlogModule } from './modules/blog/blog.module'

import { IdSubscriber } from './entity-subscribers/id.subscriber'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [SharedModule],
      inject: [EnvService],
      useFactory: (envService: EnvService) => {
        return {
          ...envService.dbConfig,
          entities: [__dirname + '/modules/**/*.entity{.ts,.js}'],
          migrations: [__dirname + '/database/migrations/*{.ts,.js}'],
          subscribers: [IdSubscriber],
        }
      },
    }),
    SharedModule,
    BlogModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
