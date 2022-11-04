import type { EntitySubscriberInterface } from 'typeorm'
import { EventSubscriber } from 'typeorm'
import { v4 } from 'uuid'

@EventSubscriber()
export class IdSubscriber implements EntitySubscriberInterface {
  beforeInsert(event: any): void {
    event.entity.id = v4().replace(/-/g, '')
  }
}
