import {isEmptyArray, isNullOrUndefined, isShortStringThan} from "../utils/primitive-checks";
import ApiError from "../utils/api-error";
import {TripValidatorPayload} from "../models/trip.models";

export const TripPayloadValidator = ({title, description, languages, countries}: TripValidatorPayload): void => {
  if (isNullOrUndefined(title)) {
    throw new ApiError(422, {message: "Title can't be blank"});
  } else if (isShortStringThan(title, 5)) {
    throw new ApiError(422, {message: "Title should have at least 8 letters!"});
  }else if (isNullOrUndefined(description)) {
    throw new ApiError(422, {message: "Description can't be blank"});
  } else if (isShortStringThan(description, 8)) {
    throw new ApiError(422, {message: "Description should have at least 8 letters!"});
  }else if (isNullOrUndefined(countries) || isEmptyArray(countries)) {
    throw new ApiError(422, {message: "Add at least one country!"});
  }else if (isNullOrUndefined(languages) || isEmptyArray(languages)) {
    throw new ApiError(422, {message: "Add at least one language!"});
  }
}
