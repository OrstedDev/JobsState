import { IAuth } from "../../../../../DomainLayer/Interfaces/Aplication/Internal/IAuth";
import {
  SetRegisterAuthFn,
  LoginAuthFn,
  GetStateAuthFn,
  LogoutFn,
  LoginWithGoogleAuthFn,
  ResetPassFn,
  ValidateLocalStorageFn,
  ReAuthenticateFn,
} from "./AuthMethods";

export class AuthUseCase implements IAuth {
  async SetUserAuth(body: IAuth.NsAuthRequest): Promise<IAuth.NsAuthResponse> {
    return await SetRegisterAuthFn(body);
  }

  async LoginAuth(body: IAuth.NsAuthRequest): Promise<IAuth.NsAuthResponse> {
    return await LoginAuthFn(body);
  }

  async LoginGoogleAuth(): Promise<IAuth.NsAuthResponse> {
    return await LoginWithGoogleAuthFn();
  }

  async ResetPass(body: IAuth.NsAuthRequest): Promise<IAuth.NsAuthResponse> {
    return await ResetPassFn(body);
  }

  async OnStateAuth(): Promise<IAuth.NsAuthResponse> {
    return await GetStateAuthFn();
  }

  async ReAuthenticate(body: IAuth.NsAuthRequest): Promise<boolean> {
    return await ReAuthenticateFn(body);
  }

  async OnLogoutAuth(): Promise<IAuth.NsAuthResponse> {
    return await LogoutFn();
  }

  ValidateLocalStorage(): boolean {
    return ValidateLocalStorageFn();
  }
}
