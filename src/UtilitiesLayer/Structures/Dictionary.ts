export default class Dictionary<T> {
  private data: Map<string, T> = new Map();

  // Inserta o actualiza un valor asociado a una clave
  insertOrUpdate(key: string, value: T): void {
    if (!key) {
      throw new Error("Key cannot be empty.");
    }
    if (value === undefined || value === null) {
      throw new Error("Value cannot be null or undefined.");
    }
    this.data.set(key, value);
  }

  // Inserta un valor solo si la clave no existe
  insertIfAbsent(key: string, value: T): void {
    if (!this.data.has(key)) {
      this.data.set(key, value);
    }
  }
  
  // Obtiene el valor asociado a una clave
  get(key: string): T | undefined {
    return this.data.get(key);
  }

  // Elimina una clave y su valor asociado
  remove(key: string): void {
    this.data.delete(key);
  }

  // Verifica si una clave existe en el diccionario
  has(key: string): boolean {
    return this.data.has(key);
  }

  // Limpia todos los elementos del diccionario
  clear(): void {
    this.data.clear();
  }

  // Devuelve todos los valores en forma de objeto plano
  getAll(): { [key: string]: T } {
    const result: { [key: string]: T } = {};
    this.data.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }

  // Serializa el diccionario a JSON
  toJSON(): string {
    return JSON.stringify(this.getAll());
  }

  // Restaura el diccionario desde un JSON
  fromJSON(json: string): void {
    const parsedData = JSON.parse(json);
    if (typeof parsedData !== "object" || parsedData === null) {
      throw new Error("Invalid JSON format.");
    }
    this.data.clear();
    Object.entries(parsedData).forEach(([key, value]) => {
      this.data.set(key, value as T);
    });
  }

  // Iterador para permitir `for...of`
  *[Symbol.iterator](): IterableIterator<[string, T]> {
    for (const entry of this.data.entries()) {
      yield entry;
    }
  }

  // Aplica una función a cada elemento
  forEach(callback: (value: T, key: string) => void): void {
    this.data.forEach((value, key) => callback(value, key));
  }

  // Crea un nuevo arreglo aplicando una función a cada elemento
  map<U>(callback: (value: T, key: string) => U): U[] {
    const result: U[] = [];
    this.data.forEach((value, key) => result.push(callback(value, key)));
    return result;
  }

  // Filtra elementos según un predicado
  filter(predicate: (value: T, key: string) => boolean): Dictionary<T> {
    const filteredDictionary = new Dictionary<T>();
    this.data.forEach((value, key) => {
      if (predicate(value, key)) {
        filteredDictionary.insertOrUpdate(key, value);
      }
    });
    return filteredDictionary;
  }
}
