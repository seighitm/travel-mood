import {isEmptyString, isNullOrUndefined} from '../utils/primitive-checks'
import ApiError from '../utils/api-error'
import prisma from '../../prisma/PrismaClient'
import commentSelector from '../selectors/comment.selector'
import commentMapper from '../mappers/comment.mapper'
import {CommentResponse} from '../types/comment.model'
import {ROLE} from './auth.service'

const getCommentById = async (commentId: string | number) => {
  return await prisma.postComment.findUnique({
    where: {
      id: Number(commentId),
    },
    select: {
      id: true,
      userId: true,
    },
  })
}

export const addComment = async (
  userId: number,
  postId: number | string,
  postType: string,
  bodyOfComment: string
): Promise<CommentResponse> => {
  if (isNullOrUndefined(bodyOfComment) || isEmptyString(bodyOfComment)) {
    throw new ApiError(422, {message: "Comment can't be blank"})
  }

  if (postType == 'trips') {
    const trip = await prisma.trip.findUnique({
      where: {
        id: Number(postId),
      },
      select: {
        id: true,
        isHidden: true,
        user: {
          select: {
            id: true,
          },
        },
        usersJoinToTrip: {
          select: {
            user: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    })
    if (isNullOrUndefined(trip)) {
      throw new ApiError(422, {message: 'Trip not found!'})
    }
  } else if (postType == 'articles') {
    const article = await prisma.article.findUnique({
      where: {
        id: Number(postId),
      },
      select: {
        id: true,
      },
    })

    if (isNullOrUndefined(article)) {
      throw new ApiError(422, {message: 'Article not found!'})
    }
  }

  const comment = await prisma.postComment.create({
    data: {
      comment: bodyOfComment,
      ...(postType == 'articles'
        ? {
          article: {
            connect: {
              id: Number(postId),
            },
          },
        }
        : {
          trip: {
            connect: {
              id: Number(postId),
            },
          },
        }),
      user: {
        connect: {id: Number(userId)},
      },
    },
    select: commentSelector,
  })

  return commentMapper(comment)
}

export const updateComment = async (
  commentId: string,
  content: string,
  userId: number
): Promise<CommentResponse> => {
  if (isNullOrUndefined(content) || isEmptyString(content)) {
    throw new ApiError(422, {message: "Comment can't be blank"})
  }

  const findComment = await prisma.postComment.findFirst({
    where: {
      id: Number(commentId),
      user: {
        id: Number(userId),
      },
    },
  })

  if (isNullOrUndefined(findComment)) {
    throw new ApiError(422, {message: 'You are not the author of the comment!'})
  }

  return await prisma.postComment.update({
    where: {
      id: Number(commentId),
    },
    data: {
      comment: content,
    },
    select: commentSelector,
  })
}

export const deleteComment = async (
  commentId: number | string,
  userId: number,
  userRole: string
): Promise<CommentResponse> => {
  const comment = await getCommentById(commentId)

  if (isNullOrUndefined(comment)) {
    throw new ApiError(422, {message: 'Comment not found!'})
  } else if (comment.userId != userId && userRole != ROLE.MODERATOR && userRole != ROLE.ADMIN) {
    throw new ApiError(404, {message: 'You are not the author of the comment!'})
  }

  return await prisma.postComment.delete({
    where: {
      id: Number(commentId),
    },
    select: {
      id: true,
    },
  })
}
