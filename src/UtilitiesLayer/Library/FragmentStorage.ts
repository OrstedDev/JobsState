import { ENV } from '../../EnvConfig';
import { Crypt0 } from "./C1p70";
import LocalStorageAdapterCls from "../../InfraestructureLayer/Cache/LocalStorage";

export class FragmentStorage {
  private Key: string;
  private LstVar: string[] = [];
  private LstData: string[] = [];

  constructor() {
    this.Key = ENV?.CPRT ?? "";
  }

  private VarFragment = (key: string): void => {
    let Token = Crypt0.C1pt0(this.Key)?.toString();
    let Split: number = Math.round(
      (Token.length + 1) / Math.round(this.Key.length / 8)
    );
    for (let i = 0, j = Split; i < Token.length; i += Split, j += Split) {
      this.LstVar.push(Token.substring(i, j) + key);
    }
  };

  private DataFragment = (value: string): void => {
    let Data = Crypt0.C1pt0(value)?.toString();
    let Split: number = Math.round(
      (Data.length + 10) / Math.round(this.LstVar.length)
    );
    for (let i = 0, j = Split; i < Data.length; i += Split, j += Split) {
      this.LstData.push(Data.substring(i, j));
    }
  };

  SetValue = (key: string, value: string): boolean => {
    try {
      this.VarFragment(key);
      this.DataFragment(value);
      for (let i = 0; i < this.LstVar.length; i++) {
        new LocalStorageAdapterCls().SetStorage(this.LstVar[i], {
          Value: this.LstData[i],
        });
      }
      return true;
    } catch (e: any) {
      localStorage.clear();
      window.location.reload();
      return false;
    }
  };

  GetValue = (key: string): string => {
    try {
      let EncryptData: string = "";
      this.VarFragment(key);
      for (let i = 0; i < this.LstVar.length; i++) {
        EncryptData += new LocalStorageAdapterCls()
          .GetStorage(this.LstVar[i])
          ?.Value?.toString();
      }
      return Crypt0.DC1pt0(EncryptData).toString();
    } catch (e: any) {
      localStorage.clear();
      window.location.reload();
      return "Err";
    }
  };

  GetValueJSON = (key: string): any | null => {
    try {
      return JSON.parse(this.GetValue(key));
    } catch (e: any) {
      localStorage.clear();
      window.location.reload();
      return null;
    }
  };

  DeleteValue = (key: string): string => {
    try {
      this.VarFragment(key);
      for (let i = 0; i < this.LstVar.length; i++) {
        new LocalStorageAdapterCls().SetStorage(this.LstVar[i], {
          Value: "",
        });
      }
      return "Ok";
    } catch (e: any) {
      localStorage.clear();
      window.location.reload();
      return "Err";
    }
  };
}
