import { Request } from 'express'

export interface IGetUserAuthInfoRequest extends Request {
  user: {
    name: string
    id: number
    role?: any
  }
  query: any
  files?: any
  file?: any
}
