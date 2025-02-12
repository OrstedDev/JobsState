export interface IGetStorage {
  GetStorage: (key: string) => any;
}

export interface ISetStorage {
  SetStorage: (key: string, value: object) => void;
}
