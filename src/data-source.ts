import { DataSource } from 'typeorm'
import * as dotenv from 'dotenv'
import { IdSubscriber } from './entity-subscribers/id.subscriber'

dotenv.config()

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  subscribers: [IdSubscriber],
  entities: [__dirname + '/modules/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/database/migrations/*{.ts,.js}'],
})
