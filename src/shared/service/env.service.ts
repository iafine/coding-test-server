import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { isNil } from 'lodash'
import type { TypeOrmModuleOptions } from '@nestjs/typeorm'

@Injectable()
export class EnvService {
  constructor(private configService: ConfigService) {}

  get isDevelopment(): boolean {
    return this.nodeEnv === 'development'
  }

  get isProduction(): boolean {
    return this.nodeEnv === 'production'
  }

  get isTest(): boolean {
    return this.nodeEnv === 'test'
  }

  private getNumber(key: string): number {
    const value = this.get(key)

    try {
      return Number(value)
    } catch {
      throw new Error(key + ' environment variable is not a number')
    }
  }

  private getBoolean(key: string): boolean {
    const value = this.get(key)

    try {
      return Boolean(JSON.parse(value))
    } catch {
      throw new Error(key + ' env var is not a boolean')
    }
  }

  private getString(key: string): string {
    const value = this.get(key)

    return value.replace(/\\n/g, '\n')
  }

  get nodeEnv(): string {
    return this.getString('NODE_ENV')
  }

  get appConfig() {
    return {
      port: this.getString('PORT'),
    }
  }

  /**
   * 获取DB环境变量
   */
  get dbConfig(): TypeOrmModuleOptions {
    return {
      type: this.getString('DB_TYPE') as any,
      name: this.getString('DB_CONNECTION_NAME'),
      host: this.getString('DB_HOST'),
      port: this.getNumber('DB_PORT'),
      username: this.getString('DB_USERNAME'),
      password: this.getString('DB_PASSWORD'),
      database: this.getString('DB_DATABASE'),
      logging: this.getBoolean('DB_LOGGING'),
      synchronize: this.getBoolean('DB_SYNCHRONIZE'),
    }
  }

  private get(key: string): string {
    const value = this.configService.get<string>(key)

    if (!value || isNil(value)) {
      throw new Error(key + ' environment variable does not set') // probably we should call process.exit() too to avoid locking the service
    }

    return value
  }
}
