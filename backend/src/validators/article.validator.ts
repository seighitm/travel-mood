import {isEmptyString, isNullOrUndefined, isShortStringThan} from "../utils/primitive-checks";
import ApiError from "../utils/api-error";
import {ARTICLE_BODY_MIN_LENGTH, ARTICLE_DESCRIPTION_MIN_LENGTH, ARTICLE_TITLE_MIN_LENGTH} from "../utils/constants";
import {ArticleValidatorPayload} from "../models/article.model";

export const ArticleCreateOrUpdateValidator = ({title, description, body, countries}:
                                                 ArticleValidatorPayload): void => {
  if (isNullOrUndefined(title)) {
    throw new ApiError(422, {message: "Title can't be blank"});
  } else if (isShortStringThan(title, ARTICLE_TITLE_MIN_LENGTH)) {
    throw new ApiError(422, {message: "Title should have at least 3 letters!"});
  }

  if (isNullOrUndefined(description)) {
    throw new ApiError(422, {message: "Description can't be blank"});
  } else if (isShortStringThan(description, ARTICLE_DESCRIPTION_MIN_LENGTH)) {
    throw new ApiError(422, {message: "Description should have at least 8 letters!"});
  }

  if (isNullOrUndefined(body)) {
    throw new ApiError(422, {message: "Content can't be blank"});
  } else if (isShortStringThan(body, ARTICLE_BODY_MIN_LENGTH)) {
    throw new ApiError(422, {message: "Content should have at least 30 letters!"});
  }

  if (isNullOrUndefined(countries) || isEmptyString(countries)) {
    throw new ApiError(422, {message: "Add at least one country!"});
  }
}
