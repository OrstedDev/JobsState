export default class Tree<T> {
  root: TreeNode<T>;
  nodeReferences: Map<T, TreeNode<T>> = new Map();

  constructor(rootValue: T) {
    this.root = new TreeNode<T>(rootValue);
    this.nodeReferences.set(rootValue, this.root);
  }

  // Agregar un nodo
  addNode(parentValue: T, childValue: T): void {
    const parentNode = this.nodeReferences.get(parentValue);
    if (!parentNode) {
      throw new Error("Parent node not found");
    }
    const childNode = new TreeNode<T>(childValue);
    parentNode.addChild(childNode);
    this.nodeReferences.set(childValue, childNode);
  }

  // Buscar un nodo
  findNode(value: T): TreeNode<T> | null {
    return this.nodeReferences.get(value) || null;
  }

  // Buscar el padre del Nodo
  getNodeParentFor(value: T): TreeNode<T> | null {
    return this.nodeReferences.get(value)?.getParent() || null;
  }

  // Buscar los hijos del Nodo
  getNodeChildrenFor(value: T): TreeNode<T>[] | null {
    return this.nodeReferences.get(value)?.getChildren() || null;
  }

  // Editar el valor de un nodo
  editNodeValue(value: T, newValue: T): void {
    const node = this.findNode(value);
    if (node) {
      node.editValue(newValue);
      this.nodeReferences.delete(value);
      this.nodeReferences.set(newValue, node);
    } else {
      throw new Error("Node not found");
    }
  }

  // Eliminar un nodo
  removeNode(value: T): void {
    const node = this.findNode(value);
    if (node && node.parent) {
      node.parent.removeChild(node);
      this.nodeReferences.delete(value);
    } else if (node === this.root) {
      throw new Error("Cannot remove the root node");
    } else {
      throw new Error("Node not found");
    }
  }

  // Obtener todos los nodos desde las referencias almacenadas
  getAllNodes(): TreeNode<T>[] {
    return Array.from(this.nodeReferences.values());
  }

  // Exportar el árbol a JSON
  toJSON(): any {
    return this.root.toJSON();
  }

  // Crear un árbol desde un objeto JSON
  static fromJSON<T>(json: any): Tree<T> {
    const tree = new Tree<T>(json.value);
    function buildTree(node: TreeNode<T>, nodeData: any) {
      nodeData.children.forEach((childData: any) => {
        const childNode = new TreeNode<T>(childData.value);
        node.addChild(childNode);
        buildTree(childNode, childData); // Recursión para agregar los hijos
      });
    }

    buildTree(tree.root, json); // Inicia la construcción del árbol
    return tree;
  }
}

class TreeNode<T> {
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

  // Exportar este nodo y sus hijos a JSON
  toJSON(): any {
    return {
      value: this.value,
      children: this.children.map((child) => child.toJSON()),
    };
  }
}
