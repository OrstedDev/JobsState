export default class ListObject<T> {
  private list: T[] = [];

  constructor(list?: T[]) {
    if (list) {
      this.list = list;
    }
  }

  // Agregar un elemento al final de la lista
  add(item: T): void {
    this.list.push(item);
  }

  // Agregar o actualizar un elemento si ya existe
  addUnique(item: T, key: keyof T): void {
    const index = this.list.findIndex((el) => el[key] === item[key]);
    if (index === -1) {
      this.list.push(item);
    } else {
      this.list[index] = item;
    }
  }

  // Insertar un elemento en una posición específica
  insertAt(index: number, item: T): void {
    try {
      if (index < 0 || index > this.list.length) {
        throw new Error("Index out of bounds");
      }
      this.list.splice(index, 0, item);
    } catch (e: any) {
      console.error(e.message);
    }
  }

  // Obtener un elemento de la lista según una propiedad
  getBy(key: keyof T, value: any): T | null {
    const found = this.list.find((el) => el[key] === value);
    return found || null;
  }

  // Editar un elemento en la lista según una propiedad
  editBy(key: keyof T, value: any, newItem: T): void {
    try {
      const index = this.list.findIndex((el) => el[key] === value);
      if (index === -1) {
        throw new Error("Item not found");
      }
      this.list[index] = newItem;
    } catch (e: any) {
      console.error(e.message);
    }
  }

  editByDynamic(key: keyof T, value: any, newItem: Partial<T>): boolean {
    try {
      const index = this.list.findIndex((el) => el[key] === value);
      
      if (index === -1) {
        throw new Error("Item not found");
      }
  
      this.list = this.list.map((el, i) =>
        i === index ? { ...el, ...newItem } : el
      );
  
      return true;
    } catch (e: any) {
      console.error("Error in editBy:", e.message);
      return false; // Si hay un error, retornamos false
    }
  }
  
  // Eliminar un elemento de la lista según una propiedad
  removeBy(key: keyof T, value: any): void {
    try {
      const index = this.list.findIndex((el) => el[key] === value);
      if (index === -1) {
        throw new Error("Item not found");
      }
      this.list.splice(index, 1);
    } catch (e: any) {
      console.error(e.message);
    }
  }

  // Obtener todos los elementos de la lista
  getAll(): T[] {
    return [...this.list];
  }

  // Verificar si la lista contiene un elemento
  contains(item: T): boolean {
    return this.list.includes(item);
  }

  // Obtener el tamaño de la lista
  size(): number {
    return this.list.length;
  }

  // Vaciar la lista
  clear(): void {
    this.list = [];
  }

  // Obtener un elemento por su índice
  get(index: number): T | null {
    if (index < 0 || index >= this.list.length) {
      return null;
    }
    return this.list[index];
  }

  // Convertir la lista a JSON
  toJSON(): any {
    return this.list;
  }

  // Método para cargar desde JSON normal o JSON string
  loadFromJSON(json: string | any[]): void {
    try {
      let parsedData: any[] = Array.isArray(json) ? json : JSON.parse(json);
      
      if (!Array.isArray(parsedData)) {
        throw new Error("Invalid JSON format: Expected an array");
      }

      this.list = parsedData;
    } catch (e: any) {
      console.error("Error parsing JSON:", e.message);
    }
  }

  // Crear una lista desde un JSON
  static fromJSON<T>(json: any): ListObject<T> {
    const listWrapper = new ListObject<T>();
    if (Array.isArray(json)) {
      listWrapper.list = json;
    }
    return listWrapper;
  }
}
