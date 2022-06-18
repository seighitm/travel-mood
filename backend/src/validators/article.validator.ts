import {isNullOrUndefined, isShortStringThan} from '../utils/primitive-checks'
import ApiError from '../utils/api-error'
import {ARTICLE_BODY_MIN_LENGTH, POST_TILE_MIN_LENGTH} from '../utils/constants'
import {ArticleValidatorPayload} from '../types/article.model'

export const ArticleCreateOrUpdateValidator = ({title, body}: ArticleValidatorPayload): void => {
  if (isNullOrUndefined(title)) {
    throw new ApiError(422, {message: "Title can't be blank"})
  } else if (isShortStringThan(title, POST_TILE_MIN_LENGTH)) {
    throw new ApiError(422, {message: `Title should have at least ${POST_TILE_MIN_LENGTH} letters!`})
  }

  if (isNullOrUndefined(body)) {
    throw new ApiError(422, {message: "Content can't be blank"})
  } else if (isShortStringThan(body, ARTICLE_BODY_MIN_LENGTH)) {
    throw new ApiError(422, {message: `Content should have at least ${ARTICLE_BODY_MIN_LENGTH} letters!`})
  }
}
