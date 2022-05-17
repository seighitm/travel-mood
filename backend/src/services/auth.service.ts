import prisma from '../../prisma/PrismaClient';
import ApiError from '../utils/api-error';
import {
  UserCreatePayload,
  UserIdEmail,
  UserLofinResponse,
  UserLoginPayload,
  UserResponse,
  UserSwitchRoleResponse,
  UserUpdatePayload
} from '../models/user.model';
import bcrypt from 'bcryptjs';
import {Prisma} from '@prisma/client';
import {generateTokens, saveToken} from './token.service';
import fs from 'graceful-fs';
import path from 'path';
import {nanoid} from 'nanoid'
import {forgotMessage} from "../utils/emailTemplates";
import {sendEmail} from "../utils/nodemailer";
import {ACTIVATED_STATUS_ENUM, RelationshipStatusEnum, RoleEnum} from "../types/enums";
import {isEmptyObject, isNullOrUndefined} from "../utils/primitive-checks";
import {mailValidator, passwordValidator} from "../validators/user.validator";

export enum ROLE {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export const createUser = async (
  input: UserCreatePayload,
  profileImage: any
): Promise<UserResponse> => {
  const payload = {
    email: input.email.trim(),
    firstName: input.firstName.trim(),
    lastName: input.lastName.trim(),
    password: input.password.trim(),
    country: input.country.trim(),
    birthday: input.birthday,
    gender: input.gender,
    languages: input.languages,
    relationshipStatus: input.relationshipStatus,
  }

  Object.entries(payload).forEach((entry: any) => {
    if (!entry[1]) throw new ApiError(422, {message: entry[0].toUpperCase() + ' can\'t be blank'});
  });

  if (!(payload.relationshipStatus in RelationshipStatusEnum)) {
    throw new ApiError(422, {message: 'Wrong relationship status!'});
  }

  await checkUserUniquenessByEmail(payload.email);

  const hashedPassword = await bcrypt.hash(payload.password, 10);

  const user = await prisma.user.create({
    data: {
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      password: hashedPassword,
      gender: {
        connect: {
          gender: payload.gender
        }
      },
      birthday: new Date(payload.birthday).toISOString(),
      relationshipStatus: {
        connect: {
          status: payload.relationshipStatus
        }
      },
      ...(!isNullOrUndefined(profileImage) && !isEmptyObject(profileImage)
          ? {
            picture: {
              connectOrCreate: {
                where: {
                  image: profileImage?.filename
                },
                create: {
                  image: profileImage?.filename
                }
              }
            },
            images: {
              connectOrCreate: {
                where: {
                  image: profileImage?.filename
                },
                create: {
                  image: profileImage?.filename
                }
              }
            },
          } : {}
      ),
      role: {
        connect: {
          role: RoleEnum.USER
        }
      },
      languages: {
        connect: payload.languages.map((item: any) => ({name: item})),
      },
      country: {
        connect: {
          code: payload.country
        },
      },
    },
    select: {
      id: true,
      role: {
        select: {
          role: true
        }
      }
    }
  });

  await saveToken(user.id, generateTokens(user).refreshToken);

  return {
    id: user.id,
    role: user.role.role,
    accessToken: generateTokens(user).accessToken,
    refreshToken: generateTokens(user).refreshToken,
  };
};

export const getCurrentUser = async (
  userId: number
): Promise<UserResponse> => {
  const user = await prisma.user.findFirst({
    where: {
      id: Number(userId)
    },
    include: {
      role: {
        select: {
          role: true
        }
      },
      picture: true,
      country: true,
      languages: true,
      gender: {
        select: {
          gender: true
        }
      },
      chats: {
        select: {id: true}
      }
    }
  });

  return {
    ...user,
    role: user?.role.role,
    accessToken: generateTokens(user).accessToken,
    refreshToken: generateTokens(user).refreshToken,
  };
};

const checkUserUniquenessByEmail = async (
  email: string
): Promise<void> => {
  const existingUserByEmail = await prisma.user.findUnique({
    where: {
      email: email
    },
    select: {
      id: true
    },
  });

  if (!isNullOrUndefined(existingUserByEmail)) {
    throw new ApiError(422, {message: 'Email has already been taken!'});
  }
};

export const login = async (userPayload: UserLoginPayload): Promise<UserLofinResponse> => {
  const payload = {
    email: userPayload.email.trim(),
    password: userPayload.password.trim(),
  }

  Object.entries(payload).forEach((entry: any) => {
    if (!entry[1]) throw new ApiError(422, {message: entry[0].toUpperCase() + ' can\'t be blank'});
  });

  mailValidator(payload.email)
  passwordValidator(payload.password)

  const user = await prisma.user.findUnique({
    where: {
      email: payload.email
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      password: true,
      picture: true,
      blockExpiration: true,
      activatedStatus: true,
      role: {
        select: {
          role: true
        }
      }
    },
  });

  if (!isNullOrUndefined(user)) {
    if (user?.activatedStatus.toString() == ACTIVATED_STATUS_ENUM.BLOCKED && new Date() < new Date(user?.blockExpiration)) {
      throw new ApiError(422, {message: 'Account is blocked!'});
    }

    if (user?.activatedStatus == ACTIVATED_STATUS_ENUM.BLOCKED) {
      await prisma.user.update({
        where: {id: user.id},
        data: {
          activatedStatus: ACTIVATED_STATUS_ENUM.ACTIVATED.toString(),
          blockExpiration: null
        }
      })
    }

    const match = await bcrypt.compare(payload.password, user.password);

    await saveToken(user.id, generateTokens(user).refreshToken);

    if (match) {
      return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role.role,
        picture: user.picture,
        accessToken: generateTokens(user).accessToken,
        refreshToken: generateTokens(user).refreshToken,
      };
    }
  }

  throw new ApiError(403, {message: 'Email or Password is invalid'});
};

export const switchRole = async (
  userId: any
): Promise<UserSwitchRoleResponse> => {
  const userDb = await prisma.user.findUnique({
    where: {
      id: Number(userId)
    },
    select: {
      role: {
        select: {
          role: true
        }
      }
    }
  })

  return await prisma.user.update({
    where: {
      id: Number(userId)
    },
    data: {
      role: {
        connect: {
          role: userDb.role.role == ROLE.USER ? ROLE.ADMIN : ROLE.USER
        }
      }
    },
    include: {
      picture: true,
      role: {
        select: {
          role: true
        }
      }
    }
  })
};

export const forgotPassword = async (
  email: string
): Promise<UserIdEmail> => {
  mailValidator(email)

  const user = await prisma.user.findUnique({
    where: {
      email: email
    },
    select: {
      email: true,
      id: true
    }
  })

  if (isNullOrUndefined(user)) {
    throw new ApiError(404, {message: 'No email could not be send'});
  }

  const resetToken: string = nanoid()

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      resetPasswordToken: resetToken,
      resetPasswordExpire: new Date(Date.now() + 10 * (60 * 1000))
    }
  })

  const resetUrl = `${process.env.URL}auth/reset-password/${resetToken}`

  const message = forgotMessage(resetUrl, user)

  const result = sendEmail({
    to: user.email,
    subject: 'Password Reset Request',
    text: message,
  })

  if (await result)
    return user
  return null
};

export const resetPassword = async (password: string, resetToken: string): Promise<UserIdEmail> => {
  passwordValidator(password)

  if (!resetToken) {
    throw new ApiError(400, {message: 'Invalid Request'});
  }

  const user = await prisma.user.findFirst({
    where: {
      AND: [
        {
          resetPasswordToken: resetToken
        },
        {
          resetPasswordExpire: {
            gt: new Date(Date.now())
          }
        }
      ]
    },
    select: {
      id: true,
      email: true
    }
  })

  if (isNullOrUndefined) {
    throw new ApiError(400, {message: 'Invalid Token or expired'});
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpire: null,
    }
  })

  return user
};


// export const findUserIdByName = async (name: string): Promise<number> => {
//   const user = await prisma.user.findUnique({
//     where: {name},
//     select: {id: true},
//   });
//
//   if (!user)
//     throw new ApiError(404, {message: 'User not found!'});
//
//   return user.id;
// };


//################################################################################################
//################################################################################################
//RAU
//################################################################################################
//################################################################################################


export const updateUser = async (
  userPayload: UserUpdatePayload,
  id: number,
  file: any,
): Promise<UserResponse | any> => {
  const {
    email,
    name,
    password,
    oldPassword,
    country,
    date,
    languages,
    gender,
    oldImages,
    profileImage,
    isUserUpdateImages,
    isUserUpdateMapCountries,
    interestedInCountries,
    visitedCountries
  }: any = userPayload;

  const dbUser = await prisma.user.findUnique({
    where: {
      id: Number(id),
    },
    select: {
      picture: true,
      images: {
        select: {
          image: true,
        },
      },
    },
  });

  console.log(oldImages)
  console.log(file)
  console.log(profileImage)
  console.log(isUserUpdateImages)

  if (isUserUpdateMapCountries) {
    await prisma.user.update({
      where: {id: Number(id)},
      data: {
        ...(interestedInCountries
            ? {interestedInCountries: {set: []}}
            : {}
        ),
        ...(visitedCountries
            ? {visitedCountries: {set: []}}
            : {}
        )
      }
    })
  }

  if (isUserUpdateImages && oldImages?.length != 0) {
    let imagesToRemove: Array<any> = [];

    if (dbUser)
      imagesToRemove = dbUser?.images?.filter((item: any) => !oldImages?.includes(item.image));

    if (imagesToRemove[0] != undefined) {
      for (let i = 0; i < imagesToRemove.length; i++)
        fs.stat(path.resolve(__dirname, '..', 'uploads', imagesToRemove[i].image), function (err, stats) {
          if (err) return console.error(err);
          fs.unlink(path.resolve(__dirname, '..', 'uploads', imagesToRemove[i].image), function (err) {
            if (err) return console.log(err);
            console.log('File deleted successfully!');
          });
        });
    }

    for (let i = 0; i < imagesToRemove.length; i++) {
      await prisma.userImage.delete({
        where: {
          image: imagesToRemove[i].image,
        },
      });
    }
  }

  if (password && password.length < 3) {
    throw new ApiError(404, {message: 'Invalid password!'});
  }

  if (oldPassword && oldPassword.length < 3) {
    throw new ApiError(404, {message: 'Invalid password!'});
  }

  if (oldPassword) {
    const userInfo = await prisma.user.findUnique({
      where: {
        id: Number(id),
      },
      select: {
        password: true,
      },
    });

    if (!bcrypt.compareSync(oldPassword, userInfo.password))
      throw new ApiError(404, {message: 'The old password is incorrect!'});
  }

  if (languages && languages.length != 0)
    await prisma.user.update({
      where: {id: Number(id)},
      data: {languages: {set: []}},
    });


  const user = await prisma.user.update({
    where: {id: Number(id)},
    data: {
      ...(interestedInCountries
          ? {
            interestedInCountries: {
              connect: interestedInCountries.map((item: any) => ({
                code: item
              }))
            },
          }
          : {}
      ),
      ...(visitedCountries
          ? {
            visitedCountries: {
              connect: visitedCountries.map((item: any) => ({
                code: item,
              }))
            }
          }
          : {}
      ),
      ...(email != undefined ? {email} : {}),
      ...(name != undefined ? {name} : {}),
      ...(password ? {password: await bcrypt.hash(password, 10)} : {}),
      ...(gender != undefined ? {gender: gender} : {}),
      ...(date != undefined ? {birthday: new Date(date).toISOString()} : {}),
      ...(Boolean(isUserUpdateImages)
          ? (profileImage != 'null' && profileImage != null && oldImages && oldImages?.includes(profileImage)
              ? {picture: profileImage}
              : {picture: 'null'}
          )
          : {}
      ),
      ...(file?.length != 0 ? {
        images: {
          create: file?.map((imageName: any) => ({image: imageName.filename})),
        },
      } : {}),
      ...(country != undefined ? {
        country: {
          connect: {name: country},
        },
      } : {}),
      ...(languages && languages.length != 0 ? {
        languages: {
          connectOrCreate: languages.map((item: any) => ({create: {name: item}, where: {name: item}})),
        },
      } : {}),
    },
    select: Prisma.validator<Prisma.UserSelect>()({
      id: true,
      email: true,
      picture: true,
      images: true,
      role: {
        select: {
          role: true
        }
      }
    }),
  });

  return {
    ...user,
    role: user.role.role,
    accessToken: generateTokens(user).accessToken,
    refreshToken: generateTokens(user).refreshToken,
  };
};
