import { BaseResponseEntity } from "../../Models/Aplication/Common/BaseResponseEntity";

export interface IInit {
  Inicializate: () => Promise<IInit.NsResponse>;

  ClearInit: () => Promise<boolean>;
}

export namespace IInit {
  export type NsResponse = BaseResponseEntity<any>;
}
