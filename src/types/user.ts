// Cinsiyet enum'u
export enum Gender {
  MALE = "male",
  FEMALE = "female",
  OTHER = "other",
  PREFER_NOT_TO_SAY = "prefer_not_to_say",
}

// Kullanıcı tipi
export interface User {
  _id: string;
  refId: string;
  datastatus: string;
  name: string;
  surname: string;
  username: string;
  email: string;
  profilePhoto: string;
  biography: string;
  gender: Gender;
  followersCount: number;
  followingCount: number;
  postCount: number;
  role: string;
  createdAt: string;
  updatedAt: string;
  termsAndConditions: boolean;
}
