class ImageManager {
  private static instance: ImageManager; // Singleton
  private imageCache: { [key: string]: HTMLImageElement } = {};
  private loaded: boolean = false;

  private constructor() {}

  public static getInstance(): ImageManager {
    if (!ImageManager.instance) {
      ImageManager.instance = new ImageManager();
    }
    return ImageManager.instance;
  }

  public async loadImagesFromURLs(urls: {
    [key: string]: string;
  }): Promise<void> {
    const cache: { [key: string]: HTMLImageElement } = {};

    const promises = Object.keys(urls).map(
      (key) =>
        new Promise<void>((resolve, reject) => {
          const url = urls[key];
          if (!url) return reject(new Error("URL inválida"));

          const img = new Image();
          img.src = url;
          img.onload = () => {
            cache[key] = img; // Almacena la imagen con el key
            resolve();
          };
          img.onerror = reject;
        })
    );

    try {
      await Promise.all(promises);
      this.imageCache = { ...this.imageCache, ...cache }; // Combina con el caché existente
      this.loaded = true; // Marca como cargado
    } catch (error) {
      console.error("Error cargando imágenes:", error);
    }
  }

  public async addOrUpdate(key: string, imageUrl: string): Promise<void> {
    const img = new Image();
    img.src = imageUrl;

    return new Promise((resolve, reject) => {
      img.onload = () => {
        this.imageCache[key] = img; // Agrega o actualiza la imagen en el caché
        resolve();
      };
      img.onerror = () => {
        reject(new Error(`No se pudo cargar la imagen desde: ${imageUrl}`));
      };
    });
  }

  public async addUnique(key: string, imageUrl: string): Promise<void> {
    if (this.imageCache[key]) {
      console.warn(`La clave "${key}" ya existe en el caché.`);
      return;
    }

    const img = new Image();
    img.src = imageUrl;
    return new Promise((resolve, reject) => {
      img.onload = () => {
        this.imageCache[key] = img;
        resolve();
      };
      img.onerror = () => {
        reject(new Error(`No se pudo cargar la imagen desde: ${imageUrl}`));
      };
    });
  }

  public async updateImage(key: string, newImageUrl: string): Promise<void> {
    const img = new Image();
    img.src = newImageUrl;
    return new Promise((resolve, reject) => {
      img.onload = () => {
        this.imageCache[key] = img; // Actualiza la imagen asociada al key
        resolve();
      };
      img.onerror = () => {
        reject(new Error(`No se pudo cargar la imagen desde: ${newImageUrl}`));
      };
    });
  }

  public async updateImageFromBlob(key: string, blob: Blob): Promise<void> {
    this.removeImage(key);

    const img = new Image();
    const url = URL.createObjectURL(blob);
    img.src = url;
    return new Promise((resolve, reject) => {
      img.onload = () => {
        this.imageCache[key] = img; // Actualiza la imagen asociada al key
        resolve();
      };
      img.onerror = () => {
        reject(new Error("Error al cargar la imagen desde el Blob."));
      };
    });
  }

  public removeImage(key: string): void {
    const img = this.imageCache[key];
    if (!img) return;

    if (img.src.startsWith("blob:")) {
      URL.revokeObjectURL(img.src);
    }

    delete this.imageCache[key];
  }

  public clearMemory(): void {
    Object.values(this.imageCache).forEach((img) => {
      if (img.src.startsWith("blob:")) {
        URL.revokeObjectURL(img.src); // Libera memoria de los blobs
      }
    });

    this.imageCache = {};
    this.loaded = false;
  }

  public getImageByKey(key: string): HTMLImageElement | undefined {
    return this.imageCache[key];
  }

  public getImageCache(): { [key: string]: HTMLImageElement } {
    return this.imageCache;
  }

  public isLoaded(): boolean {
    return this.loaded;
  }
}

export default ImageManager;
