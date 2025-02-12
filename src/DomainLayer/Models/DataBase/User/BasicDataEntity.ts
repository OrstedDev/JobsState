export type BasicDataEntity = {
  Head: string;
  User: BasicDataUserEntity;
  Contact: BasicDataContactEntity;
  Img: BasicDataImgEntity;
  Options: BasicDataOptionsEntity;
  Privileges: PrivilegesEntity;
  Active: boolean;
};

export type BasicDataUserEntity = {
  Doc: string;
  NickName: string;
  FirstName: string;
  LastName: string;
  Email: string;
  Gender: string;
  Verified: boolean;
};

export type BasicDataContactEntity = {
  PhoneNumber: string;
  Address: string;
};

export type BasicDataImgEntity = {
  ImgUser: string;
  ImgFrontPage: string;
  ImgWallpaper: string;
};

export type BasicDataOptionsEntity = {
  DarkMode: boolean;
  AccessPassword: string;
  UrlWallpaper: string;
};

export type PrivilegesEntity = {
  ProfileId: string;
  Aplications: Array<string>;
};

export type UserDataEntity = {
  Email: string;
};