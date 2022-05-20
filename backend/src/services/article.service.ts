import {
  ArticleCreatePayload,
  ArticleFindQuery,
  ArticleListResponse,
  ArticleQueryResponse,
  ArticleResponse,
  ArticleTitle,
  ArticleUpdatePayload
} from "../models/article.model";
import {ArticleImage, Prisma} from '@prisma/client';
import prisma from "../../prisma/PrismaClient";
import {articleSelector, articlesSelector} from "../selectors/article.selector";
import ApiError from "../utils/api-error";
import {CommentListResponse, CommentResponse} from "../models/comment.model";
import commentSelector from "../selectors/comment.selector";
import commentMapper from "../mappers/comment.mapper";
import {articleMapper, articlesMapper} from "../mappers/article.mapper";
import {isEmptyArray, isEmptyString, isLongArrayLengthThan, isNullOrUndefined} from "../utils/primitive-checks";
import {ArticleCreateOrUpdateValidator} from "../validators/article.validator";
import {ROLE} from "./auth.service";

export const getArticles = async (
  query: ArticleFindQuery | any,
  userId?: number,
): Promise<ArticleListResponse> => {
  const queries = buildFindAllQuery(query);
  const page = (query.page - 1) * (Number(query.limit) || 12) || 0
  const articles = await findManyArticles(queries, Number(page), Number(query.limit));
  const totalArticles = await prisma.article.count()
  return {
    articles: articles.map(article => articlesMapper(article, userId)),
    articlesCountOnPage: articles.length,
    totalCount: totalArticles
  };
};

export const removeUnusedImages = async (
  imagesToRemove: any
): Promise<void> => {
  if (!isNullOrUndefined(imagesToRemove) && !isEmptyArray(imagesToRemove)) {
    // await removeFiles(imagesToRemove.map((image: any) => image?.name))

    for (let i = 0; i < imagesToRemove.length; i++) {
      await prisma.articleImage.delete({
        where: {
          name: imagesToRemove[i].name
        }
      });
    }
  }
};

const findArticlesByTitle = async (title: string): Promise<ArticleTitle[]> => {
  return await prisma.article.findMany({
    where: {
      title: title
    },
    select: {
      id: true,
      title: true,
      images: true
    },
  });
}

export const findManyArticles = async (
  query: Prisma.ArticleWhereInput,
  offset: number,
  limit: number,
): Promise<ArticleQueryResponse[]> =>
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
  {
    title,
    description,
    body,
    tagList,
    countries,
    isPrimaryImage
  }: ArticleCreatePayload,
  images: any[],
  userId: number | string,
): Promise<ArticleResponse> => {
  ArticleCreateOrUpdateValidator({title, description, countries, body})

  console.log({
    title,
    description,
    body,
    tagList,
    countries,
    isPrimaryImage
  })

  const countOfExistingTitles = await prisma.article.count({
    where: {
      title
    }
  })

  if (countOfExistingTitles != 0) {
    throw new ApiError(422, {message: 'Title already exists!'});
  }

  const article = await prisma.article.create({
    data: {
      title,
      description,
      body,
      ...((!isNullOrUndefined(tagList) && !isEmptyArray(tagList)) ? {
        tagList: {
          connectOrCreate: tagList.map((tag: string) => ({
            create: {name: tag[0] == '#' ? tag : `#${tag}`},
            where: {name: tag[0] == '#' ? tag : `#${tag}`},
          })),
        },
      } : []),
      ...(isPrimaryImage != 'false' ? {
        primaryImage: images[0]?.key
      } : {}),
      countries: {
        connect: countries.map((item: string) => ({code: item}))
      },
      author: {
        connect: {
          id: Number(userId),
        },
      },
      ...((!isNullOrUndefined(images) && !isEmptyArray(images))
        ? {
          images: {
            create: images.map((file: { filename: string }) => ({name: file.filename}))
          }
        } : []),
    },
    select: articleSelector,
  });

  return articleMapper(article, userId);
};

export const getArticleById = async (id: string, userId?: number): Promise<ArticleResponse> => {
  const article = await prisma.article.findUnique({
    where: {
      id: Number(id)
    },
    select: articleSelector,
  });

  if (isNullOrUndefined(article)) {
    throw new ApiError(404, {message: 'Article not found!'});
  }
  return articleMapper(article, userId);
};

export const updateArticle = async (
  {
    title,
    description,
    body,
    tagList,
    countries,
    isPrimaryImage,
    oldImages,
    oldPrimaryImage,
  }: ArticleUpdatePayload,
  id: string,
  userId: number,
  userRole: string,
  files: any
): Promise<ArticleResponse> => {

  ArticleCreateOrUpdateValidator({title, description, countries, body})
  const articles = await findArticlesByTitle(title)

  const art = await getArticleById(id)

  if (!isNullOrUndefined(articles) && ((isLongArrayLengthThan(articles, 1))
    || (!isEmptyArray(articles) && articles[0]?.id != Number(id)))
  ) {
    throw new ApiError(422, {message: 'Article already exists!'});
  }

  let imagesToRemove: Array<ArticleImage> = articles[0]?.images?.filter((image: ArticleImage) => !oldImages?.includes(image.name))

  await removeUnusedImages(imagesToRemove)
  await disconnectArticlesTags(id);
  await disconnectArticlesDestinations(id);

  const updatedArticle = await prisma.article.update({
    where: {
      id: Number(id),
    },
    data: {
      ...((art && art.author.id != userId && userRole == ROLE.ADMIN)
          ? {isUpdatedByAdmin: true}
          : art && art.author.id == userId
            ? {isUpdatedByAdmin: false}
            : {}
      ),
      title: title,
      body: body,
      description: description,
      ...(!isNullOrUndefined(files) && {
        images: {
          createMany: {
            data: files?.map((item: { filename: string }) => ({name: item.filename})),
          }
        }
      }),
      ...(isPrimaryImage != 'false' ? {
          primaryImage: files[0]?.key,
        }
        : {
          primaryImage: (oldPrimaryImage != "null" && oldPrimaryImage != "" && oldPrimaryImage != null)
            ? oldPrimaryImage
            : null,
        }),
      ...(!isNullOrUndefined(tagList) && !isEmptyArray(tagList) && {
          tagList: {
            connectOrCreate: tagList.map((tag: string) => ({
              create: {name: tag},
              where: {name: tag},
            }))
          }
        }
      ),
      ...(!isEmptyArray(countries) ? {
        countries: {
          connect: countries.map((item: string) => ({name: item}))
        },
      } : {})
    },
    select: articleSelector,
  });

  return articleMapper(updatedArticle, userId);
};

export const deleteArticle = async (id: string, userId: number, userRole: string): Promise<ArticleResponse> => {
  const article = await prisma.article.findUnique({
    where: {
      id: Number(id)
    },
    select: articleSelector,
  });

  if (isNullOrUndefined(article)) {
    throw new ApiError(404, {message: 'Article not found!'});
  } else if (article.author.id !== userId && userRole != ROLE.ADMIN) {
    throw new ApiError(403, {message: 'User is not article owner!'});
  }

  await prisma.article.delete({
    where: {
      id: Number(id)
    },
    select: articleSelector,
  });

  return articleMapper(article, userId);
};

export const favoriteArticle = async (id: string, userId: number): Promise<ArticleResponse> => {
  const article = await prisma.article.update({
    where: {
      id: Number(id)
    },
    data: {
      favoritedBy: {
        connect: {id: Number(userId)},
      },
    },
    select: articleSelector,
  });

  if (isNullOrUndefined(article)) {
    throw new ApiError(404, {message: 'Article to favorite not found!'});
  }

  return {...articleMapper(article, userId)};
};

export const unFavoriteArticle = async (
  id: string,
  userId: number,
): Promise<ArticleResponse> => {
  const article = await prisma.article.update({
    where: {
      id: Number(id)
    },
    data: {
      favoritedBy: {
        disconnect: {id: Number(userId)},
      },
    },
    select: articleSelector,
  });

  if (isNullOrUndefined(article)) {
    throw new ApiError(404, {message: 'Article to favorite not found!'});
  }

  return articleMapper(article, userId);
};

const buildFindAllQuery = (query: ArticleFindQuery): Prisma.ArticleWhereInput => {
  const queries: Array<Prisma.ArticleWhereInput> = [];
  // console.log(query)
  // console.log(query.author.split(' ')[0])
  // console.log(query.author.split(' ')[1])

  if (query.author) {
    queries.push(
      {
        OR: [
          {
            OR: [
              {
                author: {
                  firstName: {
                    contains: query.author?.split(' ')[0]
                  }
                }
              },
              {
                author: {
                  firstName: {
                    contains: query.author?.split(' ')[1] ?? query.author?.split(' ')[0]
                  }
                }
              }
            ],
          },
          {
            OR: [
              {
                author: {
                  lastName: {
                    contains: query.author?.split(' ')[0]
                  }
                }
              },
              {
                author: {
                  lastName: {
                    contains: query.author?.split(' ')[1] ?? query.author?.split(' ')[0]
                  }
                }
              }
            ]
          }
        ]
      }
    )
  }
  console.log(query)


  if (query.tags && query.tags.length != 0) {
    queries.push({
      tagList: {
        some: {
          name: {
            in: query.tags
          }
        }
      },
    });
  }

  if (!isNullOrUndefined(query.title) && !isEmptyString(query.title)) {
    queries.push({
      title: {
        contains: query.title
      }
    });
  }

  if (query.countries && query.countries.length != 0) {
    queries.push({
      countries: {
        some: {
          code: {
            in: query.countries
          }
        }
      }
    });
  }

  return {AND: queries};
};

const disconnectArticlesTags = async (id: string): Promise<void> => {
  await prisma.article.update({
    where: {
      id: Number(id)
    },
    data: {
      tagList: {
        set: []
      }
    },
  });
};

const disconnectArticlesDestinations = async (id: string): Promise<void> => {
  await prisma.article.update({
    where: {
      id: Number(id)
    },
    data: {
      countries: {
        set: []
      }
    }
  });
};

export const getCommentsByArticle = async (
  id: string | number,
): Promise<CommentListResponse> => {
  const comments = await prisma.articleComment.findMany({
    where: {
      article: {id: Number(id)},
    },
    select: commentSelector,
  });

  return comments.map(comment => commentMapper(comment));
};

export const addComment = async (
  content: string,
  id: string,
  userId: number,
): Promise<CommentResponse> => {
  if (isNullOrUndefined(content) || isEmptyString(content)) {
    throw new ApiError(422, {message: "Comment can't be blank"});
  }

  const article = await prisma.article.findUnique({
    where: {
      id: Number(id)
    },
    select: {
      id: true
    },
  });

  const comment = await prisma.articleComment.create({
    data: {
      body: content,
      article: {
        connect: {id: article?.id},
      },
      author: {
        connect: {id: Number(userId)},
      },
    },
    select: commentSelector,
  });

  return commentMapper(comment);
};

export const deleteComment = async (commentId: string, userId: number, userRole: ROLE): Promise<any> => {
  const comment = await prisma.articleComment.findUnique({
    where: {
      id: Number(commentId)
    },
    select: {
      author: {
        select: {
          id: true
        }
      }
    }
  })

  if (comment.author.id !== userId && userRole != ROLE.ADMIN) {
    throw new ApiError(403, {message: 'User is not comment owner!'});
  }

  return await prisma.articleComment.delete({
    where: {
      id: Number(commentId)
    },
  })
};


export const getArticlesForAdmin = async (
  {
    search,
    sortBy,
    order,
    limit,
    page,
  }: any
): Promise<any> => {
  const activePage = (Number(page) - 1) * limit || 0
  const totalArticlesCount = await prisma.article.count({
    where: {
      OR: [
        {
          title: {
            contains: search
          }
        },
        getUsersQuery(search),
      ]
    }
  })

  const articles = await prisma.article.findMany({
    where: {
      OR: [
        {
          title: {
            contains: search
          }
        },
        getUsersQuery(search),
      ]
    },
    select: {
      id: true,
      title: true,
      createdAt: true,
      comments: true,
      author: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          picture: true
        }
      },
      favoritedBy: {
        select: {
          id: true,
        }
      },
    },
    ...(sortBy == 'date' && order != 'none' ? {orderBy: {createdAt: order}} : {}),
    ...(sortBy == 'likes' && order != 'none' ? {orderBy: {favoritedBy: {_count: order}}} : {}),
    ...(sortBy == 'comments' && order != 'none' ? {orderBy: {comments: {_count: order}}} : {}),
    ...(sortBy == 'author' && order != 'none' ? {orderBy: {author: {firstName: order}}} : {}),
    ...(sortBy == 'title' && order != 'none' ? {orderBy: {title: order}} : {}),
    skip: activePage,
    take: Number(limit),
  })

  return {
    articles: articles.map(article => ({
      id: article.id,
      title: article.title,
      author: article.author.firstName,
      date: article.createdAt,
      likes: article.favoritedBy.length,
      comments: article.comments.length,
    })),
    count: totalArticlesCount,
  };
};


export const getUsersQuery = (search: string) => {
  return {
    OR: [
      {
        OR: [
          {
            author: {
              firstName: {
                contains: search?.split(' ')[0]
              }
            }
          },
          {
            author: {
              firstName: {
                contains: search?.split(' ')[1] ?? search?.split(' ')[0]
              }
            }
          }
        ],
      },
      {
        OR: [
          {
            author: {
              lastName: {
                contains: search?.split(' ')[0]
              }
            }
          },
          {
            author: {
              lastName: {
                contains: search?.split(' ')[1] ?? search?.split(' ')[0]
              }
            }
          }
        ]
      }
    ]
  }
}
