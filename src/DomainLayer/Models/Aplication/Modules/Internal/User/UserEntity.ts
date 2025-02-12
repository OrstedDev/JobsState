export type UserEntity = {
  Id: string;
  Uid: string;
  NickName: string;
  Email: string;
  ImgUser: string;
  ProfileId: string;
  Aplications: Array<string>;
  Active: boolean;
};

export type UpdateUserEntity = {
  Pin?: string;
  Email?: string;
  Doc?: string;
  NickName?: string;
  FirstName?: string;
  LastName?: string;
  PhoneNumber?: string;
  Address?: string;
  Gender?: string;
  NewPin?: string;
};

export type PrivilegesEntity = {
  ProfileId: string;
  Aplications: Array<string>;
};
