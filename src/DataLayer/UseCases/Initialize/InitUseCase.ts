import { IInit } from "../../../DomainLayer/Interfaces/Aplication/IInit";
import { InitMethodsFn, ClearInitFn } from "./InitMethods";

export default class InitUseCase implements IInit {
  async Inicializate(): Promise<IInit.NsResponse> {
    return await InitMethodsFn();
  }

  async ClearInit(): Promise<boolean> {
    return await ClearInitFn();
  }
}
