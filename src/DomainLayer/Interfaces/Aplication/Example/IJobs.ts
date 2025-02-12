import { BaseResponseEntity } from "../../../Models/Aplication/Common/BaseResponseEntity";

import { JobOfferEntity } from "../../../Models/Aplication/Modules/Example/JobsEntity";

export interface IJobs {
  insert(jobs: IJobs.NsJobOffer[]): Promise<boolean>;

  Get: () => Promise<IJobs.NsJobOffer[]>;
}

export namespace IJobs {
  export type NsJobOffer = JobOfferEntity;
}
