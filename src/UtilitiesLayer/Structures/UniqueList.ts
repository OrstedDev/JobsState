export default class UniqueList<T> {
  private items: Set<T>;

  constructor() {
    this.items = new Set();
  }

  add(item: T): void {
    this.items.add(item); // `Set` garantiza unicidad
  }

  remove(item: T): void {
    this.items.delete(item); // Elimina el elemento si existe
  }

  getAll(): T[] {
    return Array.from(this.items); // Convierte el `Set` a un array
  }

  has(item: T): boolean {
    return this.items.has(item); // Verifica si el elemento existe
  }

  size(): number {
    return this.items.size; // Retorna el tamaño del `Set`
  }
}
