import ApiError from "../utils/api-error";
import {validateAccessToken} from "../services/token.service";
import {getCurrentUser} from "../services/auth.service";

const getTokenFromHeaders = (req: { headers: { authorization: string } }): string | null => {
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer')
    return req.headers.authorization.split(' ')[1];
  return null;
};

export const authM = {
  required: async (req, res, next) => {
    try {
      const accessToken = getTokenFromHeaders(req)

      if (!accessToken)
        return next(new ApiError(401, {errors: {body: ["Unauthorized"]}}));

      const userData: any = validateAccessToken(accessToken);

      if (!userData)
        return next(new ApiError(401, {errors: {body: ["Unauthorized"]}}));

      req.user = await getCurrentUser(Number(userData.id))
      next();
    } catch (e) {
      return next(new ApiError(401, {errors: {body: ["Unauthorized"]}}));
    }
  },
  optional: async (req, res, next) => {
    const accessToken = getTokenFromHeaders(req)

    if (accessToken) {
      const userData: any = validateAccessToken(accessToken);

      if (userData)
        req.user = await getCurrentUser(Number(userData.id))
    } else{
      req.user = null
    }

    next();
  }
}
