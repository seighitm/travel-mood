import ApiError from "../utils/api-error";
import {validateAccessToken} from "../services/token.service";
import {getCurrentUser} from "../services/auth.service";
import {isNullOrUndefined} from "../utils/primitive-checks";

const getTokenFromHeaders = (req: { headers: { authorization: string } }): string | null => {
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer')
    return req.headers.authorization.split(' ')[1];
  return null;
};

export const authMiddleware = {
  required: async (req, res, next) => {
    try {
      const accessToken = getTokenFromHeaders(req)

      if (isNullOrUndefined(accessToken))
        return next(new ApiError(401, {message: "User is unauthorized!"}));

      const userData: any = validateAccessToken(accessToken);

      if (isNullOrUndefined(userData))
        return next(new ApiError(401, {message: "User is unauthorized!"}));

      const currentUser: any = await getCurrentUser(Number(userData.id))

      if (!isNullOrUndefined(userData) && currentUser?.activatedStatus == 'BLOCKED')
        return next(new ApiError(401, {message: "User is blocked!"}));

      req.user = currentUser
      next();
    } catch (e) {
      return next(new ApiError(401, {message: "User is unauthorized!"}));
    }
  },
  optional: async (req, res, next) => {
    const accessToken = getTokenFromHeaders(req)

    if (!isNullOrUndefined(accessToken)) {
      const userData: any = validateAccessToken(accessToken);

      if (!isNullOrUndefined(userData))
        req.user = await getCurrentUser(Number(userData.id))
    } else {
      req.user = null
    }

    next();
  }
}

export const roleCheckMiddleware = (roles: any) => {
  return async (req, res, next) => {
    if (req.method === "OPTIONS") {
      next()
    }

    try {
      const accessToken = getTokenFromHeaders(req)

      if (isNullOrUndefined(accessToken))
        return next(new ApiError(401, {message: "User is unauthorized!"}));

      const userData: any = validateAccessToken(accessToken);

      if (isNullOrUndefined(userData))
        return next(new ApiError(401, {message: "User is unauthorized!"}));

      const currentUser: any = await getCurrentUser(Number(userData.id))

      if (!isNullOrUndefined(userData) && currentUser?.activatedStatus == 'BLOCKED')
        return next(new ApiError(401, {message: "User is blocked!"}));

      if (!roles.includes(currentUser.role))
        return next(new ApiError(403, {message: "User is unauthorized!"}));

      req.user = userData;
      next();
    } catch (e) {
      console.log(e)
      return next(new ApiError(401, {message: "User is unauthorized!"}));
    }
  }
};
