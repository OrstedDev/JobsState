import { BaseResponseEntity } from "../../../Models/Aplication/Common/BaseResponseEntity";
import { AuthUserEntity } from "../../../Models/Aplication/Modules/Internal/Authorization/AuthUserEntity";

export interface IAuth {
  SetUserAuth: (body: IAuth.NsAuthRequest) => Promise<IAuth.NsAuthResponse>;

  LoginAuth: (body: IAuth.NsAuthRequest) => Promise<IAuth.NsAuthResponse>;

  LoginGoogleAuth: () => Promise<IAuth.NsAuthResponse>;

  ResetPass: (body: IAuth.NsAuthRequest) => Promise<IAuth.NsAuthResponse>;

  OnStateAuth: () => Promise<IAuth.NsAuthResponse>;

  ReAuthenticate: (body: IAuth.NsAuthRequest) => Promise<boolean>;

  OnLogoutAuth: () => Promise<IAuth.NsAuthResponse>;

  ValidateLocalStorage: () => boolean;
}

export namespace IAuth {
  export type NsAuthResponse = BaseResponseEntity<null>;
  export type NsAuthRequest = AuthUserEntity;
}
