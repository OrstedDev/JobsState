import { v4 as uuidv4 } from "uuid";
import TreeObject, {
  TreeNode,
} from "../../../UtilitiesLayer/Structures/TreeObject";
import {
  ObjetcEntity,
  AplicationEntity,
  AplicationGetEntity,
} from "../../../DomainLayer/Models/Aplication/Modules/Configuration/AplicationEntity";

export default class AplicationUseCase {
  private App = new TreeObject<AplicationEntity>("0", {
    Key: "0",
    Value: "APP",
    IsVisible: false,
    IsEnabled: true,
  });

  constructor(jsonString?: string) {
    try {
      if (jsonString !== undefined) {
        this.App = TreeObject.fromJSON<AplicationEntity>(
          JSON.parse(jsonString)
        );
      }
    } catch (e: any) {
      console.error(e.message);
    }
  }

  exist(ref: string): boolean {
    return this.App.getItem(ref) !== null;
  }

  getAllMapNodes(): Array<{ key: string; node: TreeNode<AplicationEntity> }> {
    return this.App.getAllMapNodes();
  }

  get(ref: string): AplicationEntity | null {
    return this.App.getItem(ref);
  }

  getParentFor(name: string): AplicationEntity | null {
    return this.App.getParentFor(name);
  }

  getAllParents(ref: string): AplicationEntity[] {
    return this.App.getAallParentValues(ref);
  }

  getAllRefParents(ref: string): string[] {
    try {
      let listRef: string[] = [];
      this.recAllRefParents(ref, listRef);
      return listRef;
    } catch (e: any) {
      return [];
    }
  }

  recAllRefParents(ref: string, listRef: string[]): void {
    listRef.push(ref);
    if (ref !== "0" && this.exist(ref)) {
      this.recAllRefParents(
        ref.replace(":" + this.App.getItem(ref)?.Key, ""),
        listRef
      );
    }
  }

  getChilldren(ref: string): AplicationGetEntity[] {
    return (
      this.App.getNodeChildrenFor(ref)?.map((item): AplicationGetEntity => {
        return {
          Key: item.value.Key,
          Value: item.value.Value,
          Name: item.value.Name,
          Description: item.value.Description,
          CreatedAt: item.value.CreatedAt,
          IsVisible: item.value.IsVisible,
          IsEnabled: item.value.IsEnabled,
          ItemValues: item.value.ItemValues,
          Ref: this.App.getAallParentValues(ref + ":" + item.value.Key)
            .map((item): any => item.Key)
            .join(":"),
        };
      }) || []
    );
  }

  getKeys(Ref: string): string[] {
    return (
      this.App.getNodeChildrenFor(Ref)?.map((item) => String(item.value.Key)) ||
      []
    );
  }

  add(Ref: string, Data: AplicationEntity): { ref: string; success: boolean } {
    try {
      let Key: string;

      do {
        Key = uuidv4().slice(0, 12);
      } while (this.getKeys(Ref).includes(Key));

      Data.ItemValues = Data.ItemValues?.map((item): ObjetcEntity => {
        let KeyItemValues: string;

        do {
          KeyItemValues = uuidv4().slice(0, 12);
        } while (this.getKeys(Ref).includes(KeyItemValues));

        return { Key: KeyItemValues, Value: item.Value, Name: item.Name };
      });

      this.App.addNode(Ref, `${Ref}:${Key}`, {
        Key: Key,
        Value: Data.Value,
        Name: Data.Name,
        Description: Data.Description,
        CreatedAt: new Date(),
        IsVisible: Data.IsVisible,
        IsEnabled: Data.IsEnabled,
        ItemValues: Data.ItemValues,
      });

      return { ref: `${Ref}:${Key}`, success: true };
    } catch (e: any) {
      return { ref: "", success: false };
    }
  }

  deleteNode(Ref: string): boolean {
    this.App.removeNode(Ref);
    return true;
  }

  removeAllDescendants(Ref: string): boolean {
    this.App.removeAllDescendants(Ref);
    return true;
  }

  edit(Ref: string, Data: AplicationEntity): boolean {
    if (
      !this.getChilldren(Ref).some(
        (x) => x.Value === Data.Value && x.Key != Data.Key
      )
    ) {
      Data.ItemValues = Data.ItemValues?.map((item): ObjetcEntity => {
        let KeyItemValues: string | undefined = item.Key;
        if (item.Key === undefined) {
          do {
            KeyItemValues = uuidv4().slice(0, 12);
          } while (this.getKeys(Ref).includes(KeyItemValues));
        }

        return { Key: KeyItemValues, Value: item.Value, Name: item.Name };
      });

      this.App.editNodeValue(Ref, {
        Key: Data.Key,
        Value: Data.Value,
        Name: Data.Name,
        Description: Data.Description,
        CreatedAt: Data.CreatedAt,
        IsVisible: Data.IsVisible,
        IsEnabled: Data.IsEnabled,
        ItemValues: Data.ItemValues,
      });
      return true;
    }
    return false;
  }

  getToStringJSON(): string {
    return JSON.stringify(this.App.toJSON());
  }

  getToStringIdentedJSON(): string {
    return JSON.stringify(this.App.toJSON(), null, 2);
  }

  SetToJSON(jsonString: string): void {
    try {
      if (jsonString !== undefined) {
        this.App = TreeObject.fromJSON<AplicationEntity>(
          JSON.parse(jsonString)
        );
      }
    } catch (e: any) {
      console.error(e.message);
    }
  }

  clear() {
    this.App.clear();
  }
}
