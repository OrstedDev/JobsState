import { ENV } from "../../EnvConfig";
import CryptoJS from "crypto-js";

class C1p70 {
  private CryptoJS: typeof CryptoJS = CryptoJS;
  private CryptoIv: any;
  private CryptoKey: any;

  constructor() {
    this.CryptoKey = this.CryptoJS.enc.Hex.parse(ENV?.KPRT ?? "");

    this.CryptoIv = this.CryptoJS.enc.Hex.parse(ENV?.KIVT ?? "");
  }

  C1pt0 = (value: string): string => {
    try {
      return this.CryptoJS.AES.encrypt(value, this.CryptoKey, {
        iv: this.CryptoIv,
      }).toString();
    } catch (e: any) {
      localStorage.clear();
      window.location.reload();
      return "Err";
    }
  };

  DC1pt0 = (value: string): string => {
    try {
      const bytes = this.CryptoJS.AES.decrypt(value, this.CryptoKey, {
        iv: this.CryptoIv,
      });
      const decrypted = bytes.toString(this.CryptoJS.enc.Utf8);
      return decrypted;
    } catch (e: any) {
      localStorage.clear();
      window.location.reload();
      return "Err";
    }
  };

  C1pt0ToHex = (value: string): string => {
    try {
      const ciphertext = this.CryptoJS.AES.encrypt(value, this.CryptoKey, {
        iv: this.CryptoIv,
      }).ciphertext.toString(this.CryptoJS.enc.Hex);
      return ciphertext;
    } catch (e: any) {
      localStorage.clear();
      window.location.reload();
      return "Err";
    }
  };

  DC1pt0FromHex = (value: string): string => {
    try {
      const encryptedHex = this.CryptoJS.enc.Hex.parse(value);
      const decrypted = this.CryptoJS.AES.decrypt(
        { ciphertext: encryptedHex } as any,
        this.CryptoKey,
        { iv: this.CryptoIv }
      ).toString(this.CryptoJS.enc.Utf8);
      return decrypted;
    } catch (e: any) {
      localStorage.clear();
      window.location.reload();
      return "Err";
    }
  };
}

export const Crypt0 = new C1p70();
