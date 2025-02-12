import { JobOfferEntity } from "../../../Models/Aplication/Modules/Example/JobsEntity";

export interface IJobs {
  insert(jobs: IJobs.NsJobOffer[]): Promise<boolean>;

  Get: () => Promise<IJobs.NsJobOffer[]>;

  updateJob(id: string, data: Partial<IJobs.NsJobOffer>): Promise<boolean>;

  deleteJob(id: string): Promise<boolean>;

  deleteExpiredJobs(): Promise<boolean>;
}
export namespace IJobs {
  export type NsJobOffer = JobOfferEntity;
}
