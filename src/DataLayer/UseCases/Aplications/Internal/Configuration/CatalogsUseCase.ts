import { v4 as uuidv4 } from "uuid";
import TreeObject from "../../../../../UtilitiesLayer/Structures/TreeObject";
import { CatalogEntity } from "../../../../../DomainLayer/Models/Aplication/Modules/Internal/Configuration/CatalogEntity";

export class CatalogosUseCase {
  private Catalogs = new TreeObject<CatalogEntity>("Catalogs", {});

  constructor(jsonString?: string) {
    try {
      if (jsonString !== undefined) {
        this.Catalogs = TreeObject.fromJSON<CatalogEntity>(
          JSON.parse(jsonString)
        );
      }
    } catch (e: any) {
      console.error(e.message);
    }
  }

  get(): CatalogEntity[] {
    return (
      this.Catalogs.getNodeChildrenFor("Catalogs")?.map(
        (item): CatalogEntity => {
          return {
            Key: item.value.Key,
            Value: item.value.Value,
            KeyRef: item.value.KeyRef,
          };
        }
      ) || []
    );
  }

  getKeys(): string[] {
    return (
      this.Catalogs.getNodeChildrenFor("Catalogs")?.map((item) =>
        String(item.value.Key)
      ) || []
    );
  }

  getItems(catalogKey: string): CatalogEntity[] {
    return (
      this.Catalogs.getNodeChildrenFor(`Catalogs:${catalogKey}`)?.map(
        (item): CatalogEntity => {
          return {
            Key: item.value.Key,
            Value: item.value.Value,
            KeyRef: item.value.KeyRef,
            KeyParent: item.parent?.value.Key,
          };
        }
      ) || []
    );
  }

  getItemsKey(catalogKey: string): string[] {
    return (
      this.Catalogs.getNodeChildrenFor(`Catalogs:${catalogKey}`)?.map((item) =>
        String(item.value.Key)
      ) || []
    );
  }

  add(catalogName: string, KeyParent?: string): boolean {
    let catalogKey: string;

    do {
      catalogKey = uuidv4().slice(0, 12);
    } while (this.getKeys().includes(catalogKey));

    this.Catalogs.addNode("Catalogs", `Catalogs:${catalogKey}`, {
      Key: catalogKey,
      Value: catalogName,
      KeyRef: KeyParent,
    });

    return true;
  }

  addItem(catalogKey: string, value: string, KeyParent?: string): boolean {
    let key: string;

    do {
      key = uuidv4().slice(0, 12);
    } while (this.getItemsKey(catalogKey).includes(key));

    this.Catalogs.addNode(`Catalogs:${catalogKey}`, `${catalogKey}:${key}`, {
      Key: key,
      Value: value,
      KeyRef: KeyParent,
    });

    return true;
  }

  delete(catalogKey: string): boolean {
    this.Catalogs.removeNode(`Catalogs:${catalogKey}`);
    return true;
  }

  deleteItem(catalogKey: string, key: string): boolean {
    this.Catalogs.removeNode(`${catalogKey}:${key}`);
    return true;
  }

  editItem(Data: CatalogEntity): boolean {
    if (
      !this.getItems(Data.KeyParent ?? "").some(
        (x) => x.Value === Data.Value && x.Key != Data.Key
      )
    ) {
      this.Catalogs.editNodeValue(`${Data.KeyParent}:${Data.Key}`, {
        Key: Data.Key,
        Value: Data.Value,
      });
      return true;
    }
    return false;
  }

  edit(Data: CatalogEntity): boolean {
    if (!this.get().some((x) => x.Value === Data.Value && x.Key != Data.Key)) {
      this.Catalogs.editNodeValue(`Catalogs:${Data.Key}`, {
        Key: Data.Key,
        Value: Data.Value,
      });
      return true;
    }
    return false;
  }

  getToStringJSON(): string {
    return JSON.stringify(this.Catalogs.toJSON());
  }

  SetToJSON(json: string): void {
    this.Catalogs = TreeObject.fromJSON(json);
  }
}
