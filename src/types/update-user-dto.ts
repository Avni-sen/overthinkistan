import { Gender } from "./user";

export interface UpdateUserDto {
  name?: string;
  surname?: string;
  email?: string;
  profilePhoto?: string;
  biography?: string;
  gender?: Gender;
}
