import { IJobs } from "../../../../../DomainLayer/Interfaces/Aplication/Example/IJobs";
import {
  insertJobsFn,
  getAllJobsFn,
  updateJobFn,
  deleteJobFn,
  deleteExpiredJobsFn,
} from "./JobsMethods";

export default class JobsUseCase implements IJobs {
  async insert(jobs: IJobs.NsJobOffer[]): Promise<boolean> {
    return await insertJobsFn(jobs);
  }

  async Get(): Promise<IJobs.NsJobOffer[]> {
    return await getAllJobsFn();
  }

  async updateJob(
    id: string,
    data: Partial<IJobs.NsJobOffer>
  ): Promise<boolean> {
    return await updateJobFn(id, data);
  }

  async deleteJob(id: string): Promise<boolean> {
    return await deleteJobFn(id);
  }

  async deleteExpiredJobs(): Promise<boolean> {
    return await deleteExpiredJobsFn();
  }
}
