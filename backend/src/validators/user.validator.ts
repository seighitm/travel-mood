import {isEmptyArray, isNullOrUndefined, isShortStringThan} from "../utils/primitive-checks";
import ApiError from "../utils/api-error";

enum GENDER_ENUM {
  FEMALE = "FEMALE",
  MALE = "MALE",
  OTHER = "OTHER",
  MALE_GROUP = "MALE_GROUP",
  FEMALE_GROUP = "FEMALE_GROUP",
  ANY = "ANY",
}

export const UserPayloadValidator = ({gender, birthday, languages}: any): void => {
  if (!isNullOrUndefined(isNullOrUndefined) && (GENDER_ENUM[gender] == undefined)) {
    throw new ApiError(422, {message: 'Wrong Gender format!'});
  }

  if (isNullOrUndefined(languages) || isEmptyArray(languages)) {
    throw new ApiError(422, {message: 'You did not enter any language!'});
  }

  if (!isNullOrUndefined(birthday) && (new Date().getTime() < new Date(birthday).getTime())) {
    throw new ApiError(422, {message: 'Birthday is incorrect!'});
  }
}

export const mailValidator = (email: string): void => {
  if (isNullOrUndefined(email)) {
    throw new ApiError(404, {message: 'You did not enter your email!'});
  }else if (!(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email))) {
    throw new ApiError(422, {message: 'Invalid email format!'});
  }
}

export const passwordValidator = (password: string): void => {
  if (isNullOrUndefined(password)) {
    throw new ApiError(404, {message: 'You did not enter your password!'});
  } else if (!isNullOrUndefined(password) && isShortStringThan(password, 8)) {
    throw new ApiError(404, {message: 'Password should have at least 8 letters!'});
  }
}
