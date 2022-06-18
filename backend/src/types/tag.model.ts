import { Prisma } from '@prisma/client'

export interface Tag {
  id: number
  name: string
  _count: Prisma.TagCountOutputType
  tagName: string
}

export type TagsResponse = Pick<Tag, 'id' | 'name' | '_count'>
