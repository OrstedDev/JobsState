import { BaseResponseEntity } from "../../Models/Aplication/Common/BaseResponseEntity";
import { ConfigEntity } from "../../Models/Aplication/Modules/Configuration/ConfigEntity";

export interface IConfigApp {
  Set: (
    data: Array<IConfigApp.NsConfigApp>
  ) => Promise<IConfigApp.NsRespConfigApp>;

  Get: () => Promise<IConfigApp.NsRespConfigApp>;

  SetImg: (Img: any, Route: string, Name: string) => Promise<string>;

  DeleteImg: (Route: string, Name: string) => Promise<boolean>;
}

export namespace IConfigApp {
  export type NsConfigApp = ConfigEntity;
  export type NsRespConfigApp = BaseResponseEntity<Array<NsConfigApp>>;
}
