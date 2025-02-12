export type ExperienceEntity = {
  name: string;
  description: string;
  typeInst: string;
  adress: string;
  dateInit: Date;
  dateOut: Date;
  ImgLogo: string;
};

export type ImgExperienceEntity = {
  name: string;
  blob: any;
};

export type ExperienceRetEntity = ExperienceEntity & {
  id?: number;
};
