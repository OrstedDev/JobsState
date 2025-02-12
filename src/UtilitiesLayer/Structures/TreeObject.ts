export default class TreeObject<T> {
  root: TreeNode<T>;
  nodeReferences: Map<string, TreeNode<T>> = new Map();

  constructor(rootName: string, rootValue: T) {
    this.root = new TreeNode<T>(rootValue);
    this.nodeReferences.set(rootName, this.root);
  }

  // Agregar un nodo
  addNode(parentName: string, childName: string, childValue: T): void {
    try {
      const parentNode = this.nodeReferences.get(parentName);
      if (!parentNode) {
        throw new Error("Parent node not found");
      }
      const childNode = new TreeNode<T>(childValue);
      parentNode.addChild(childNode);
      this.nodeReferences.set(childName, childNode);
    } catch (e: any) {
      console.log(e.message);
    }
  }

  // Buscar un nodo por nombre
  findNodeByName(name: string): TreeNode<T> | null {
    return this.nodeReferences.get(name) || null;
  }

  getItem(name: string): T | null {
    return this.nodeReferences.get(name)?.value || null;
  }

  // Buscar el padre de un nodo por nombre
  getNodeParentFor(name: string): TreeNode<T> | null {
    return this.nodeReferences.get(name)?.getParent() || null;
  }

  getParentFor(name: string): T | null {
    return this.nodeReferences.get(name)?.getParent()?.value || null;
  }

  // Buscar los hijos de un nodo por nombre
  getNodeChildrenFor(name: string): TreeNode<T>[] | null {
    return this.nodeReferences.get(name)?.getChildren() || null;
  }

  // Editar el valor de un nodo por nombre
  editNodeValue(name: string, newValue: T): void {
    try {
      const node = this.findNodeByName(name);
      if (node) {
        node.editValue(newValue);
      } else {
        throw new Error("Node not found");
      }
    } catch (e: any) {
      console.log(e.message);
    }
  }

  // Eliminar un nodo por nombre
  removeNode(name: string): void {
    try {
      const node = this.findNodeByName(name);
      if (node && node.parent) {
        node.parent.removeChild(node);
        this.nodeReferences.delete(name);
      } else if (node === this.root) {
        throw new Error("Cannot remove the root node");
      } else {
        throw new Error("Node not found");
      }
    } catch (e: any) {
      console.log(e.message);
    }
  }

  removeAllDescendants(name: string): void {
    try {
      const node = this.findNodeByName(name);
      if (node && node.parent) {
        this.recRemoveAllDescendants(node);

        node.parent.removeChild(node);

        this.nodeReferences.delete(name);
      } else if (node === this.root) {
        throw new Error("Cannot remove the root node");
      } else {
        throw new Error("Node not found");
      }
    } catch (e: any) {
      console.log(e.message);
    }
  }

  private recRemoveAllDescendants(node: TreeNode<T>): void {
    const children = node.getChildren();
    children.forEach((child) => {
      const key = this.getAllMapNodes().find((x) => x.node === child)?.key;
      console.log(key);
      if (key !== undefined) {
        this.nodeReferences.delete(key);
      }

      this.recRemoveAllDescendants(child);
    });
  }

  // Obtener todos los nodos desde las referencias almacenadas
  getAllNodes(): TreeNode<T>[] {
    return Array.from(this.nodeReferences.values());
  }

  getAllMapNodes(): { key: string; node: TreeNode<T> }[] {
    return Array.from(this.nodeReferences.entries()).map(([key, node]) => ({
      key: key,
      node: node,
    }));
  }

  getRoot(): TreeNode<T> {
    return this.root;
  }

  clear(): void {
    const deleteNodes = (node: TreeNode<T>) => {
      node.getChildren().forEach((child) => {
        deleteNodes(child);
        const nodeKey = this.getAllMapNodes().find(
          (x) => x.node === child
        )?.key;
        if (nodeKey !== undefined) {
          this.nodeReferences.delete(nodeKey);
        }
      });
      node.children = [];
    };

    deleteNodes(this.root);
  }

  // Método para concatenar los valores de los padres hasta la raíz
  getAallParentValues(name: string): T[] {
    let currentNode: TreeNode<T> | null = this.findNodeByName(name);
    const result: T[] = []; // Lista para almacenar los valores de los padres

    while (currentNode) {
      result.unshift(currentNode.value); // Agregar el valor al inicio de la lista
      currentNode = currentNode.parent; // Moverse al nodo padre
    }

    return result; // Devolver la lista de valores
  }

  // Convertir el árbol a JSON
  toJSON(): any {
    const nameNodeMapping: Map<TreeNode<T>, string> = new Map();
    this.nodeReferences.forEach((node, name) =>
      nameNodeMapping.set(node, name)
    );

    const buildJSON = (node: TreeNode<T>): any => {
      const name = nameNodeMapping.get(node) || "Unknown";
      return {
        name,
        value: node.value,
        children: node.children.map((child) => buildJSON(child)),
      };
    };

    return buildJSON(this.root);
  }

  // Construir un árbol desde JSON
  static fromJSON<T>(json: any): TreeObject<T> {
    try {
      if (!json || typeof json.name !== "string" || !("value" in json)) {
        throw new Error("Invalid JSON structure");
      }

      // Crear el árbol con la raíz
      const tree = new TreeObject<T>(json.name, json.value);

      // Función recursiva para agregar nodos desde el JSON
      const addChildren = (parentName: string, children: any[]): void => {
        for (const child of children) {
          if (typeof child.name !== "string" || !("value" in child)) {
            throw new Error("Invalid child node structure in JSON");
          }
          tree.addNode(parentName, child.name, child.value);
          if (Array.isArray(child.children) && child.children.length > 0) {
            addChildren(child.name, child.children);
          }
        }
      };

      // Agregar los hijos de la raíz
      if (Array.isArray(json.children) && json.children.length > 0) {
        addChildren(json.name, json.children);
      }

      return tree;
    } catch (e: any) {
      console.log(e.message);
    }
    return new TreeObject<T>("Error", {} as T);
  }
}

export class TreeNode<T> {
  value: T;
  parent: TreeNode<T> | null = null;
  children: TreeNode<T>[] = [];

  constructor(value: T) {
    this.value = value;
  }

  // Agregar un hijo
  addChild(child: TreeNode<T>): void {
    child.parent = this;
    this.children.push(child);
  }

  // Editar el valor del nodo
  editValue(newValue: T): void {
    this.value = newValue;
  }

  // Eliminar un hijo
  removeChild(child: TreeNode<T>): void {
    this.children = this.children.filter((c) => c !== child);
  }

  // Obtener el padre del nodo
  getParent(): TreeNode<T> | null {
    return this.parent;
  }

  // Obtener los hijos del nodo
  getChildren(): TreeNode<T>[] {
    return this.children;
  }
}
