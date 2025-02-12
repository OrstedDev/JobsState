import { IJobs } from "../../../../../DomainLayer/Interfaces/Aplication/Example/IJobs";
import { insertJobsFn, getAllJobsFn } from "./JobsMethods";

export default class JobsUseCase implements IJobs {
  async insert(jobs: IJobs.NsJobOffer[]): Promise<boolean> {
    return await insertJobsFn(jobs);
  }

  async Get(): Promise<IJobs.NsJobOffer[]> {
    return await getAllJobsFn();
  }
}
