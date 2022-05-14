import { Profile } from './user.model';

export interface Language {
  id: number,
  name: string,
  trip: any,
  users: any[],
  tripCount: number,
  userCount: number,
  _count: number
}

export type LanguagesResponse = Pick<Language, 'id' | 'name' | 'tripCount' | 'userCount' >;

