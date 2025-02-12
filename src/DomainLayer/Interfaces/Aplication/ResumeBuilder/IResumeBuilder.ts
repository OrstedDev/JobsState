import { BaseResponseEntity } from "../../../Models/Aplication/Common/BaseResponseEntity";

import {
  ExperienceEntity,
  ExperienceRetEntity,
  ImgExperienceEntity,
} from "../../../Models/Aplication/Modules/ExperienceEntity";

export interface IResumeBuilder {
  SetExperience: (
    data: IResumeBuilder.NsExperienceIn
  ) => Promise<IResumeBuilder.NsResponse>;
  SetImgInstitution: (data: IResumeBuilder.NsImgExperience) => Promise<string>;
  GetAllExperience: () => Promise<IResumeBuilder.NsResponse>;
  DeleteExperience: (id: string) => Promise<boolean>;
}

export namespace IResumeBuilder {
  export type NsExperienceIn = ExperienceEntity;
  export type NsExperienceOut = ExperienceRetEntity;
  export type NsImgExperience = ImgExperienceEntity;
  export type NsResponse = BaseResponseEntity<any>;
}
