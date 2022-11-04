import { v4 } from 'uuid'

export const generateId = () => {
  return v4().replace(/-/g, '')
}
