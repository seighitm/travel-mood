import {isEmptyArray, isLongStringThan, isNullOrUndefined, isShortStringThan} from '../utils/primitive-checks'
import ApiError from '../utils/api-error'
import {TripValidatorPayload} from '../types/trip.models'
import {POST_TILE_MAX_LENGTH, POST_TILE_MIN_LENGTH} from "../utils/constants";

export const TripPayloadValidator = ({title, description, languages, countries}: TripValidatorPayload): void => {
  if (isNullOrUndefined(title)) {
    throw new ApiError(422, {message: "Title can't be blank"})
  } else if (isShortStringThan(title, POST_TILE_MIN_LENGTH) || isLongStringThan(title, POST_TILE_MAX_LENGTH)) {
    throw new ApiError(422, {message: `The title must contain a minimum of ${POST_TILE_MIN_LENGTH} and a maximum of ${POST_TILE_MAX_LENGTH} characters!`})
  } else if (isNullOrUndefined(description)) {
    throw new ApiError(422, {message: "Description can't be blank"})
  } else if (isShortStringThan(description, POST_TILE_MIN_LENGTH)) {
    throw new ApiError(422, {message: `Description should have at least ${POST_TILE_MIN_LENGTH}} letters!`})
  } else if (isNullOrUndefined(countries) || isEmptyArray(countries)) {
    throw new ApiError(422, {message: 'Add at least one country!'})
  } else if (isNullOrUndefined(languages) || isEmptyArray(languages)) {
    throw new ApiError(422, {message: 'Add at least one language!'})
  }
}
