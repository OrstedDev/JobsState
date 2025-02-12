import ListObject from "../../../UtilitiesLayer/Structures/ListObject";
import { PrivilegesEntity } from "../../../DomainLayer/Models/Aplication/Modules/Configuration/PrivilegesEntity";

export default class PrivilegesUseCase {
  private privilegesTables = new ListObject<PrivilegesEntity>();

  constructor(privilegesTables?: string) {
    try {
      if (privilegesTables !== undefined) {
        this.privilegesTables = ListObject.fromJSON<PrivilegesEntity>(
          JSON.parse(privilegesTables)
        );
      }
    } catch (e: any) {
      console.error(e.message);
    }
  }

  getAll(): PrivilegesEntity[] {
    return this.privilegesTables.getAll();
  }

  get(Key: string): PrivilegesEntity | null {
    return this.privilegesTables.getBy("Key", Key);
  }

  add(Data: PrivilegesEntity): boolean {
    this.privilegesTables.addUnique(Data, "Key");
    return true;
  }

  edit(Data: PrivilegesEntity): boolean {
    this.privilegesTables.editBy("Key", Data.Key, Data);
    return true;
  }

  delete(Key: string): void {
    this.privilegesTables.removeBy("Key", Key);
  }

  getToStringJSON(): string {
    return JSON.stringify(this.privilegesTables.toJSON());
  }

  SetToJSON(json: any): void {
    this.privilegesTables = ListObject.fromJSON<PrivilegesEntity>(json);
  }
}
