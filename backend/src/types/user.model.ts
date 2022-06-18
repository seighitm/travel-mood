export interface User {
  id: number
  email: string
  password: string
  picture: any
  messages: object
  relationshipStatus: any
  chats: object
  createdAt: Date
  updatedAt: Date
  accessToken: string
  refreshToken: string
  followedBy?: any
  following?: any
  oldPassword: string
  country: any
  date: Date
  aboutMe?: string
  languages?: any[]
  gender?: any
  role: any
  lastName: any
  firstName: any
  profileImage: any
  oldImages: any
  birthday: any
  interestedInCountries: string[]
  visitedCountries: string[]
}

export type UserCreatePayload = Pick<
  User,
  | 'relationshipStatus'
  | 'languages'
  | 'lastName'
  | 'firstName'
  | 'email'
  | 'password'
  | 'country'
  | 'birthday'
  | 'gender'
>

export type UserUpdatePayload = Pick<
  User,
  'profileImage' | 'oldImages' | 'email' | 'password' | 'oldPassword' | 'country' | 'date' | 'languages' | 'gender'
>

export type UserLoginPayload = Pick<User, 'email' | 'password'>

export type UserQueryResponse = Pick<User, 'picture' | 'email'>

export type UserResponse = Pick<User, 'accessToken' | 'refreshToken' | 'id' | 'role'>

export type UserSwitchRoleResponse = Pick<User, 'id' | 'role'>

export type AuthorQueryResponse = Pick<
  User,
  'picture' | 'id' | 'firstName' | 'lastName' | 'gender' | 'followedBy' | 'following'
>

export type FollowersQueryResponse = Pick<User, 'id'>

export type Profile = Pick<User, 'picture' | 'id' | 'firstName' | 'lastName' | 'following' | 'gender'>

export type UserLofinResponse = Pick<
  User,
  'id' | 'firstName' | 'lastName' | 'role' | 'picture' | 'accessToken' | 'refreshToken'
>

export type UserId = Pick<User, 'id'>

export type UserIdEmail = Pick<User, 'email' | 'id'>

export type UserUpdateMap = Pick<User, 'interestedInCountries' | 'visitedCountries'>

export type UserUpdatePersonalInfoPayload = Pick<User, 'email' | 'password' | 'oldPassword'>

export type UserUpdateGeneralInfoPayload = Pick<
  User,
  'relationshipStatus' | 'aboutMe' | 'firstName' | 'lastName' | 'country' | 'birthday' | 'languages' | 'gender'
>

export type UserUpdateGeneralInfoResponse = Pick<
  User,
  'id' | 'email' | 'firstName' | 'lastName' | 'birthday' | 'gender' | 'role' | 'accessToken' | 'refreshToken'
>
