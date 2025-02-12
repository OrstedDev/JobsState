import { BaseResponseEntity } from "../../../Models/Aplication/Common/BaseResponseEntity";
import {
  UserEntity,
  UpdateUserEntity,
} from "../../../Models/Aplication/Modules/Internal/User/UserEntity";
import { PrivilegesEntity } from "../../../Models/Aplication/Modules/Internal/User/UserEntity";

export interface IUser {
  getAllUsers(): Promise<IUser.NsResponse>;

  updateUserPrivileges(
    UserDocRef: any,
    Uid: string,
    Privileges: IUser.NSPrivilegesEntity
  ): Promise<boolean>;

  updateUserInfo(Body: IUser.NsUpdateUserEntity): Promise<boolean>;

  validatePin(Pin: string): Promise<boolean>;

  getPin(): Promise<string>;

  updateUserUrl(Url: string, Type: IUser.ImageType): Promise<boolean>;

  updateImgWallpaper(ListUrl: string): Promise<boolean>;

  updateUrlWallpaper(ListUrl: string): Promise<boolean>;

  updateUserDarkMode(DarkMode: boolean): Promise<boolean>;

  setImg(Img: any, Route: string, Name: string): Promise<string>;

  deleteImg(Route: string, Name: string): Promise<boolean>;
}

export namespace IUser {
  export type NsResponse = BaseResponseEntity<Array<UserEntity>>;
  export type NsUserEntity = UserEntity;
  export type NsUpdateUserEntity = UpdateUserEntity;
  export type NSPrivilegesEntity = PrivilegesEntity;

  export type ImageType = "ProfilePicture" | "ProfileBackground";
}
