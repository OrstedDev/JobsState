import { IUser } from "../../../../../DomainLayer/Interfaces/Aplication/Internal/IUser";
import {
  getAllUsersFn,
  updateUserPrivilegesFn,
  SetImgFn,
  DeleteImgFn,
  updateUserUrlFn,
  updateUserInfoFn,
  updateImgWallpaperFn,
  updateUrlWallpaperFn,
  validatePinFn,
  getPinFn,
  updateUserDarkModeFn,
} from "./UserMethods";

export default class UserUseCase implements IUser {
  async getAllUsers(): Promise<IUser.NsResponse> {
    return await getAllUsersFn();
  }

  async updateUserPrivileges(
    UserDocRef: any,
    Uid: string,
    Privileges: IUser.NSPrivilegesEntity
  ): Promise<boolean> {
    return await updateUserPrivilegesFn(UserDocRef, Uid, Privileges);
  }

  async updateUserInfo(Body: IUser.NsUpdateUserEntity): Promise<boolean> {
    return await updateUserInfoFn(Body);
  }

  async validatePin(Pin: string): Promise<boolean> {
    return await validatePinFn(Pin);
  }

  async getPin(): Promise<string>{
    return await getPinFn();
  }

  async updateUserUrl(Url: string, Type: IUser.ImageType): Promise<boolean> {
    return await updateUserUrlFn(Url, Type);
  }

  async updateImgWallpaper(ListUrl: string): Promise<boolean> {
    return await updateImgWallpaperFn(ListUrl);
  }

  async updateUrlWallpaper(ListUrl: string): Promise<boolean> {
    return await updateUrlWallpaperFn(ListUrl);
  }

  async updateUserDarkMode(DarkMode: boolean): Promise<boolean> {
    return await updateUserDarkModeFn(DarkMode);
  }

  async setImg(Img: any, Route: string, Name: string): Promise<string> {
    return await SetImgFn(Img, Route, Name);
  }

  async deleteImg(Route: string, Name: string): Promise<boolean> {
    return await DeleteImgFn(Route, Name);
  }
}
