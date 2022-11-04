import { Global, Module } from '@nestjs/common'
import { EnvService } from './service/env.service'

const providers = [EnvService]

@Global()
@Module({
  providers,
  imports: [],
  exports: [...providers],
})
export class SharedModule {}
