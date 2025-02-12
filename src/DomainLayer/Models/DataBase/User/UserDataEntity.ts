export type UserDataEntity = {
  Uid: string;
  User: BasicDataUserEntity;
  Img: BasicDataImgEntity;
  Privileges: PrivilegesEntity;
  Metadata: BasicDataMetadataEntity;
  Online: boolean;
  Active: boolean;
};

export type BasicDataMetadataEntity = {
  CreationTime?: Date;
  LastSignInTime?: Date;
};

export type BasicDataUserEntity = {
  NickName: string;
  Email: string;
};

export type BasicDataImgEntity = {
  ImgUser: string;
};

export type PrivilegesEntity = {
  ProfileId: string;
  Aplications: Array<string>;
};
