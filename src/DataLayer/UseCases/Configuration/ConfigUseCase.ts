import { IConfigApp } from "../../../DomainLayer/Interfaces/Aplication/IConfig";
import { GetConfigFn, SetConfigFn, SetImgFn, DeleteImgFn } from "./ConfigFn";

export class ConfigUseCase implements IConfigApp {
  async Set(
    data: Array<IConfigApp.NsConfigApp>
  ): Promise<IConfigApp.NsRespConfigApp> {
    return await SetConfigFn(data);
  }

  async Get(): Promise<IConfigApp.NsRespConfigApp> {
    return await GetConfigFn();
  }

  async SetImg(Img: any, Route: string, Name: string): Promise<string> {
    return await SetImgFn(Img, Route, Name);
  }

  async DeleteImg(Route: string, Name: string): Promise<boolean> {
    return await DeleteImgFn(Route, Name);
  }
}
