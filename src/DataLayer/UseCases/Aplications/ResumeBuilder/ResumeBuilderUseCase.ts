import { IResumeBuilder } from "../../../../DomainLayer/Interfaces/Aplication/ResumeBuilder/IResumeBuilder";
import {
  SetExperienceFn,
  GetAllExperienceFn,
  DeleteExperienceFn,
  SetImgInstitutionFn
} from "./Experience";

export class ResumeBuilderUseCase implements IResumeBuilder {
  async SetExperience(
    data: IResumeBuilder.NsExperienceIn
  ): Promise<IResumeBuilder.NsResponse> {
    return await SetExperienceFn(data);
  }

  async SetImgInstitution(data: IResumeBuilder.NsImgExperience): Promise<string> {
    return await SetImgInstitutionFn(data);
  }

  async GetAllExperience(): Promise<IResumeBuilder.NsResponse> {
    return await GetAllExperienceFn();
  }

  async DeleteExperience(id: string): Promise<boolean> {
    return await DeleteExperienceFn(id);
  }
}
