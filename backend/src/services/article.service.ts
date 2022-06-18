import {
  ArticleCreatePayload,
  ArticleFindQuery,
  ArticleListResponse,
  ArticleQueryResponse,
  ArticleResponse,
  ArticleTitle,
  ArticleUpdatePayload,
} from '../types/article.model'
import {Prisma} from '@prisma/client'
import prisma from '../../prisma/PrismaClient'
import {articleSelector, articlesSelector} from '../selectors/article.selector'
import ApiError from '../utils/api-error'
import {articleMapper, articlesMapper} from '../mappers/article.mapper'
import {isEmptyArray, isEmptyString, isLongArrayLengthThan, isNullOrUndefined} from '../utils/primitive-checks'
import {ArticleCreateOrUpdateValidator} from '../validators/article.validator'
import {ROLE} from './auth.service'
import {TagsResponse} from '../types/tag.model'
import fs from 'fs-extra'
import path from 'path'

export const getArticles = async (query: ArticleFindQuery | any, userId?: number): Promise<ArticleListResponse> => {
  const queries = buildFindAllQuery(query)
  const page = (query.page - 1) * (Number(query.limit) || 12) || 0
  const articles = await findManyArticles(queries, Number(page), Number(query.limit))
  const totalArticles = await prisma.article.count()
  return {
    articles: articles.map((article: any) => articlesMapper(article, userId)),
    articlesCountOnPage: articles.length,
    totalCount: totalArticles,
  }
}

// export const removeUnusedImages = async (
//   imagesToRemove: any
// ): Promise<void> => {
//   if (!isNullOrUndefined(imagesToRemove) && !isEmptyArray(imagesToRemove)) {
//     // await removeFiles(imagesToRemove.map((image: any) => image?.name))
//
//     for (let i = 0; i < imagesToRemove.length; i++) {
//       await prisma.articleImage.delete({
//         where: {
//           name: imagesToRemove[i].name
//         }
//       });
//     }
//   }
// };

const removeUnusedImages = async (imagesToRemove: any[]) => {
  if (!isNullOrUndefined(imagesToRemove) && !isEmptyArray(imagesToRemove)) {
    if (process.env.NODE_ENV !== 'PRODUCTION')
      for (let i = 0; i < imagesToRemove.length; i++) {
        fs.remove(path.resolve(__dirname, '..', 'uploads', imagesToRemove[i]), (err) => {
          if (err) console.log(err)
          console.log('File deleted successfully!')
        })

        // s3.deleteObject({Bucket: process.env.AWS_BUCKET_NAME, Key: imagesToRemove[0]}, (err, data) => {
        //   if (err) console.log(err, err.stack);
        //   else console.log('delete', data);
        // })
      }
    await prisma.articleImage.deleteMany({
      where: {
        name: {
          in: imagesToRemove,
        },
      },
    })
  }
}

const findArticlesByTitle = async (title: string): Promise<ArticleTitle[]> => {
  return await prisma.article.findMany({
    where: {
      title: title,
    },
    select: {
      author: {
        select: {
          id: true,
        },
      },
      body: true,
      id: true,
      title: true,
      images: true,
    },
  })
}

export const findManyArticles = async (
  query: Prisma.ArticleWhereInput,
  offset: number,
  limit: number
): Promise<ArticleQueryResponse[] | any> =>
  await prisma.article.findMany({
    where: query,
    orderBy: {
      id: 'desc',
    },
    skip: offset || 0,
    take: limit || 12,
    select: articlesSelector,
  })

export const createArticle = async (
  {title, body, tagList, countries, isPrimaryImage, editorImages}: ArticleCreatePayload | any,
  images: any[],
  userId: number | string
): Promise<ArticleResponse> => {
  ArticleCreateOrUpdateValidator({title, body})

  const countOfExistingTitles = await prisma.article.count({
    where: {
      title,
    },
  })

  if (countOfExistingTitles != 0) {
    throw new ApiError(422, {message: 'Title already exists!'})
  }

  if (!isNullOrUndefined(tagList) && !isEmptyArray(tagList)) {
    let blockedTags: string = ''
    for (let i = 0; i < tagList.length; i++) {
      const findTag = await prisma.tag.findFirst({
        where: {
          status: 'BLOCKED',
          name: tagList[i][0] == '#' ? tagList[i] : '#' + tagList[i],
        },
      })
      if (findTag) blockedTags += findTag.name + ', '
    }
    blockedTags = blockedTags.slice(0, -2)

    if (blockedTags?.length != 0) {
      throw new ApiError(422, {message: 'Tags [' + blockedTags + '] are not allowed!'})
    }
  }

  const allImages: any = body
    .match(/http:\/\/localhost([^"]*)/g)
    ?.map((item: any) => item.split('/')[item.split('/').length - 1])

  if (!isNullOrUndefined(editorImages))
    if (allImages && allImages?.length != 0) {
      const imagesToRemove = editorImages.filter((image: any) => !allImages.includes(image))
      await removeUnusedImages(imagesToRemove)
    } else {
      await removeUnusedImages(editorImages)
    }

  const article = await prisma.article.create({
    data: {
      title,
      body,
      ...(!isNullOrUndefined(tagList) && !isEmptyArray(tagList)
        ? {
          tagList: {
            connectOrCreate: tagList.map((tag: string) => ({
              where: {name: tag},
              create: {name: tag[0] == '#' ? tag : `#${tag}`},
            })),
          },
        }
        : []),
      ...(isPrimaryImage != 'false'
        ? {
          primaryImage: images[0][process.env.NODE_ENV == 'PRODUCTION' ? 'key' : 'filename']
        }
        : {}),
      ...(!isNullOrUndefined(countries) && !isEmptyArray(countries)
        ? {
          countries: {
            connect: countries.map((item: string) => ({code: item})),
          },
        }
        : []),
      author: {
        connect: {
          id: Number(userId),
        },
      },
      ...(!isNullOrUndefined(images) && !isEmptyArray(images)
        ? {
          images: {
            create: images.map((file: any) => ({name: file[process.env.NODE_ENV == 'PRODUCTION' ? 'key' : 'filename']})),
          },
        }
        : []),
    },
    select: articleSelector,
  })

  return articleMapper(article, userId)
}

export const getArticleById = async (id: string, userId?: number): Promise<ArticleResponse> => {
  const article = await prisma.article.findUnique({
    where: {id: Number(id)},
    select: articleSelector,
  })
  if (isNullOrUndefined(article)) {
    throw new ApiError(404, {message: 'Article not found!'})
  }
  return articleMapper(article, userId)
}

export const updateArticle = async (
  {title, body, tagList, countries, isPrimaryImage, oldImages, oldPrimaryImage, editorImages}: ArticleUpdatePayload,
  id: string,
  userId: number,
  userRole: string,
  files: any
): Promise<ArticleResponse> => {
  ArticleCreateOrUpdateValidator({title, body})
  const article: any = await findArticlesByTitle(title)

  const art = await getArticleById(id)

  if (
    !isNullOrUndefined(article) &&
    (isLongArrayLengthThan(article, 1) || (!isEmptyArray(article) && article[0]?.id != Number(id)))
  ) {
    throw new ApiError(422, {message: 'Article already exists!'})
  }

  if (article[0]?.author.id != userId && userRole != ROLE.MODERATOR && userRole != ROLE.ADMIN) {
    throw new ApiError(404, {message: 'You are not the author of the comment!'})
  }

  if (!isNullOrUndefined(tagList) && !isEmptyArray(tagList)) {
    let blockedTags: string = ''
    for (let i = 0; i < tagList.length; i++) {
      const findTag = await prisma.tag.findFirst({
        where: {
          status: 'BLOCKED',
          name: tagList[i][0] == '#' ? tagList[i] : '#' + tagList[i],
        },
      })
      if (findTag) blockedTags += findTag.name + ', '
    }
    blockedTags = blockedTags.slice(0, -2)

    if (blockedTags?.length != 0) {
      throw new ApiError(422, {message: 'Tags [' + blockedTags + '] are not allowed!'})
    }
  }
  let imagesToRemove: any = article[0]?.images?.filter((image: any) => !oldImages?.includes(image.name))

  if (!isNullOrUndefined(imagesToRemove) && !isEmptyArray(imagesToRemove)) {
    await removeUnusedImages(imagesToRemove.map((item: any) => item.name))
  }

  const currentAllImages: any = art?.body
    ?.match(/http:\/\/localhost([^"]*)/g)
    ?.map((item: any) => item.split('/')[item.split('/').length - 1])

  const allImages: any = body
    .match(/http:\/\/localhost([^"]*)/g)
    ?.map((item: any) => item.split('/')[item.split('/').length - 1])

  if (allImages && allImages?.length != 0) {
    const imagesToRemove = editorImages?.filter((image: any) => !allImages.includes(image))
    await removeUnusedImages(imagesToRemove)
  } else {
    await removeUnusedImages(editorImages)
  }

  if (currentAllImages && currentAllImages?.length != 0) {
    const imagesToRemove = currentAllImages.filter((image: any) => !allImages?.includes(image))
    await removeUnusedImages(imagesToRemove)
  }

  await disconnectArticlesTags(id)
  await disconnectArticlesDestinations(id)

  const updatedArticle = await prisma.article.update({
    where: {
      id: Number(id),
    },
    data: {
      ...(art && art.author.id != userId && (userRole == ROLE.ADMIN || userRole == ROLE.MODERATOR)
        ? {isUpdatedByAdmin: true}
        : art && art.author.id == userId
          ? {isUpdatedByAdmin: false}
          : {}),
      title: title,
      body: body,
      ...(!isNullOrUndefined(files) && {
        images: {
          createMany: {
            data: files?.map((item: any) => ({name: item[process.env.NODE_ENV == 'PRODUCTION' ? 'key' : 'filename']})),
          },
        },
      }),
      ...(isPrimaryImage != 'false'
        ? {
          primaryImage: files[0][process.env.NODE_ENV == 'PRODUCTION' ? 'key' : 'filename'],
        }
        : {
          primaryImage:
            oldPrimaryImage != 'null' && oldPrimaryImage != '' && oldPrimaryImage != null ? oldPrimaryImage : null,
        }),
      ...(!isNullOrUndefined(tagList) &&
        !isEmptyArray(tagList) && {
          tagList: {
            connectOrCreate: tagList.map((tag: string) => ({
              create: {name: tag},
              where: {name: tag},
            })),
          },
        }),
      ...(!isNullOrUndefined(countries) && !isEmptyArray(countries)
        ? {
          countries: {
            connect: countries.map((item: string) => ({name: item})),
          },
        }
        : []),
    },
    select: articleSelector,
  })

  return articleMapper(updatedArticle, userId)
}

export const deleteArticle = async (id: string, userId: number, userRole: string): Promise<ArticleResponse> => {
  const article = await prisma.article.findUnique({
    where: {
      id: Number(id),
    },
    select: articleSelector,
  })

  if (isNullOrUndefined(article)) {
    throw new ApiError(404, {message: 'Article not found!'})
  } else if (article.author.id !== userId && userRole != ROLE.ADMIN && userRole != ROLE.MODERATOR) {
    throw new ApiError(403, {message: 'User is not article owner!'})
  }

  await prisma.article.delete({
    where: {
      id: Number(id),
    },
    select: articleSelector,
  })

  return articleMapper(article, userId)
}

export const favoriteArticle = async (id: string, userId: number): Promise<ArticleResponse> => {
  const article = await prisma.article.update({
    where: {
      id: Number(id),
    },
    data: {
      favoritedBy: {
        connect: {id: Number(userId)},
      },
    },
    select: articleSelector,
  })

  if (isNullOrUndefined(article)) {
    throw new ApiError(404, {message: 'Article to favorite not found!'})
  }

  return {...articleMapper(article, userId)}
}

export const unFavoriteArticle = async (id: string, userId: number): Promise<ArticleResponse> => {
  const article = await prisma.article.update({
    where: {
      id: Number(id),
    },
    data: {
      favoritedBy: {
        disconnect: {id: Number(userId)},
      },
    },
    select: articleSelector,
  })

  if (isNullOrUndefined(article)) {
    throw new ApiError(404, {message: 'Article to favorite not found!'})
  }

  return articleMapper(article, userId)
}

const buildFindAllQuery = (query: ArticleFindQuery | any): Prisma.ArticleWhereInput => {
  const queries: Array<Prisma.ArticleWhereInput> = []

  if (query.author) {
    const authorName = query.author.toLowerCase()
    queries.push({
      OR: [
        {
          AND: [
            {
              author: {
                lastName: {
                  equals: authorName?.split(' ')[0],
                  mode: 'insensitive',
                },
              },
            },
            {
              author: {
                firstName: {
                  startsWith: authorName?.split(' ')[1] ?? authorName?.split(' ')[0],
                  mode: 'insensitive',
                },
              },
            },
          ],
        },
        {
          AND: [
            {
              author: {
                firstName: {
                  contains: authorName,
                  mode: 'insensitive',
                },
              },
            },
          ],
        },
        {
          AND: [
            {
              author: {
                lastName: {
                  contains: authorName,
                  mode: 'insensitive',
                },
              },
            },
          ],
        },
      ],
    })
  }

  if (query.tags && query.tags.length != 0) {
    queries.push({
      tagList: {
        some: {
          name: {
            in: query.tags,
          },
        },
      },
    })
  }

  if (!isNullOrUndefined(query.title) && !isEmptyString(query.title)) {
    queries.push({
      title: {
        contains: query.title?.toLowerCase(),
        mode: 'insensitive',
      },
    })
  }

  if (query.countries && query.countries.length != 0) {
    queries.push({
      countries: {
        some: {
          code: {
            in: query.countries,
          },
        },
      },
    })
  }

  return {AND: queries}
}

const disconnectArticlesTags = async (id: string): Promise<void> => {
  await prisma.article.update({
    where: {
      id: Number(id),
    },
    data: {
      tagList: {
        set: [],
      },
    },
  })
}

const disconnectArticlesDestinations = async (id: string): Promise<void> => {
  await prisma.article.update({
    where: {
      id: Number(id),
    },
    data: {
      countries: {
        set: [],
      },
    },
  })
}

export const getUsersQuery = (search: string) => {
  return {
    OR: [
      {
        OR: [
          {
            author: {
              firstName: {
                contains: search?.split(' ')[0],
              },
            },
          },
          {
            author: {
              firstName: {
                contains: search?.split(' ')[1] ?? search?.split(' ')[0],
              },
            },
          },
        ],
      },
      {
        OR: [
          {
            author: {
              lastName: {
                contains: search?.split(' ')[0],
              },
            },
          },
          {
            author: {
              lastName: {
                contains: search?.split(' ')[1] ?? search?.split(' ')[0],
              },
            },
          },
        ],
      },
    ],
  }
}

export const getTags = async (query: { tagName: string } & any, userRole: number | string): Promise<TagsResponse[]> => {
  const queries: Array<Prisma.TagWhereInput> = []

  if (!isNullOrUndefined(query.tagName) && !isEmptyArray(query.tagName)) {
    queries.push({
      name: {
        contains: query.tagName,
      },
    })
  }

  if (!(userRole == ROLE.ADMIN && query.showBlocked == 'true'))
    // if (userRole != ROLE.ADMIN && (!isNullOrUndefined(query.showBlocked) && query.showBlocked == false))
    queries.push({
      status: {
        equals: 'ACTIVATED',
      },
    })

  return await prisma.tag.findMany({
    where: {
      AND: queries,
    },
    select: {
      id: true,
      name: true,
      status: true,
      _count: true,
    },
    orderBy: {
      articles: {
        _count: 'desc',
      },
    },
  })
}
