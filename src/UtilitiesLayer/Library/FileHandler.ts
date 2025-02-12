class FileHandler {
  // Método para exportar cualquier archivo
  static exportFile(
    data: string | Blob,
    fileName: string = "file",
    fileType: string = "application/json"
  ): void {
    // Crear un Blob con los datos proporcionados
    const blob = new Blob([data], { type: fileType });

    // Crear un enlace de descarga
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName; // Nombre del archivo a descargar
    link.click(); // Simular un clic para descargar el archivo
  }

  // Método para importar cualquier archivo
  static importFile(file: File, callback: (content: string) => void): void {
    // Crear un objeto FileReader para leer el contenido del archivo
    const reader = new FileReader();

    // Definir lo que sucede cuando el archivo se carga
    reader.onload = (event: ProgressEvent<FileReader>) => {
      // Llamar al callback con el contenido del archivo (en formato texto)
      if (event.target) {
        callback(event.target.result as string);
      }
    };

    // Leer el archivo como texto
    reader.readAsText(file);
  }
}

export default FileHandler;
