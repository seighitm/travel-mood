import { UserImage } from "@prisma/client";

export interface ProfileResponse {
  id?: number,
  picture: string | UserImage;
  firstName: string;
  lastName: string;
  followedBy: any[];
}
