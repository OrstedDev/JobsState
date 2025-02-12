import { v4 as uuidv4 } from "uuid";
import ListObject from "../../../../../UtilitiesLayer/Structures/ListObject";
import { CryptoEntity } from "../../../../../DomainLayer/Models/Aplication/Modules/Internal/Configuration/CryptoEntity";

export class CryptoConfigUseCase {
  private cryptoTables = new ListObject<CryptoEntity>();

  constructor(cryptoTables?: string) {
    try {
      if (cryptoTables !== undefined) {
        this.cryptoTables = ListObject.fromJSON<CryptoEntity>(JSON.parse(cryptoTables));
      }
    } catch (e: any) {
      console.error(e.message);
    }
  }

  getAll(): CryptoEntity[] {
    return this.cryptoTables.getAll();
  }

  get(Key: string): CryptoEntity | null {
    return this.cryptoTables.getBy("Key", Key);
  }

  add(Data: CryptoEntity): boolean {
    if (!this.cryptoTables.getAll().some((x) => x.Name === Data.Name)) {
      do {
        Data.Key = uuidv4().slice(0, 12);
      } while (
        this.cryptoTables.getAll().filter((item) => item.Key === Data.Key)
          .length > 0
      );

      this.cryptoTables.add(Data);
      return true;
    }
    return false;
  }

  edit(Data: CryptoEntity): boolean {
    if (
      !this.cryptoTables
        .getAll()
        .some((x) => x.Name === Data.Name && x.Key != Data.Key)
    ) {
      this.cryptoTables.editBy("Key", Data.Key, Data);
      return true;
    }
    return false;
  }
  
  delete(Key: string): void {
    this.cryptoTables.removeBy("Key", Key);
  }

  getToStringJSON(): string {
    return JSON.stringify(this.cryptoTables.toJSON());
  }

  SetToJSON(json: any): void {
    this.cryptoTables = ListObject.fromJSON<CryptoEntity>(json);
  }
}
