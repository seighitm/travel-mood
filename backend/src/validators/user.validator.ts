import { isEmptyArray, isEmptyString, isNullOrUndefined, isShortStringThan } from '../utils/primitive-checks'
import ApiError from '../utils/api-error'
import { RelationshipStatusEnum } from '../types/enums'

enum GENDER_ENUM {
  FEMALE = 'FEMALE',
  MALE = 'MALE',
  OTHER = 'OTHER',
  MALE_GROUP = 'MALE_GROUP',
  FEMALE_GROUP = 'FEMALE_GROUP',
  ANY = 'ANY',
}

export const UserPayloadValidator = ({
  gender,
  birthday,
  languages,
  country,
  relationshipStatus,
  accountDataPayload = null,
}: any): void => {
  if (accountDataPayload != null) {
    Object.entries(accountDataPayload).forEach((entry: any) => {
      if (!entry[1]) {
        throw new ApiError(422, { message: entry[0].toUpperCase() + " can't be blank" })
      }
    })
  }

  if (isNullOrUndefined(birthday) || birthday == 'null') {
    throw new ApiError(422, { message: 'Birthday is required!' })
  } else if (Math.abs(new Date(Date.now() - new Date(birthday).getTime()).getUTCFullYear() - 1970) < 18) {
    throw new ApiError(422, { message: 'You have to be at least 18 to use travel mood!' })
  }

  if (isNullOrUndefined(gender) || isEmptyString(gender)) {
    throw new ApiError(422, { message: 'Gender is required!' })
  } else if (GENDER_ENUM[gender] == undefined) {
    throw new ApiError(422, { message: 'Wrong gender format!' })
  }

  if (isNullOrUndefined(languages) || isEmptyArray(languages)) {
    throw new ApiError(422, { message: 'Languages are required!' })
  }

  if (isNullOrUndefined(country) || isEmptyString(country)) {
    throw new ApiError(422, { message: 'Country is required!' })
  }

  if (
    !isNullOrUndefined(relationshipStatus) &&
    !['', 'null'].includes(relationshipStatus) &&
    !(relationshipStatus in RelationshipStatusEnum)
  ) {
    throw new ApiError(422, { message: 'Wrong relationship status!' })
  }
}

export const mailValidator = (email: string): void => {
  if (isNullOrUndefined(email)) {
    throw new ApiError(404, { message: 'You did not enter your email!' })
  } else if (
    !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      email
    )
  ) {
    throw new ApiError(422, { message: 'Invalid email format!' })
  }
}

export const passwordValidator = (password: string): void => {
  if (isNullOrUndefined(password)) {
    throw new ApiError(404, { message: 'You did not enter your password!' })
  } else if (!isNullOrUndefined(password) && isShortStringThan(password, 8)) {
    throw new ApiError(404, { message: 'Password should have at least 8 letters!' })
  }
}

