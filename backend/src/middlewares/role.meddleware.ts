import ApiError from "../utils/api-error";
import {validateAccessToken} from "../services/token.service";

const getTokenFromHeaders = (req: { headers: { authorization: string } }): string | null => {
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer')
    return req.headers.authorization.split(' ')[1];
  return null;
};

const AuthMiddleware = (roles: any) => {
  return function (req, res, next) {
    if (req.method === "OPTIONS") {
      next()
    }

    try {
      const accessToken = getTokenFromHeaders(req)

      if (!accessToken)
        return next(new ApiError(401, {errors: {body: ["Unauthorized"]}}));

      const userData: any = validateAccessToken(accessToken);
      if (!userData)
        return next(new ApiError(401, {errors: {body: ["Unauthorized"]}}));

      if (!roles.includes(userData.role))
        return next(new ApiError(403, {errors: {body: ["Permission Denied"]}}));

      req.user = userData;
      next();
    } catch (e) {
      console.log(e)
      return next(new ApiError(401, {message: "Unauthorized"}));
    }
  }
};

export default AuthMiddleware
