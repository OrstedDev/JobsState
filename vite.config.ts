import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import obfuscatorPlugin from "vite-plugin-javascript-obfuscator";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    obfuscatorPlugin({
      include: [/.*\.js$/, /.*\.ts$/, /.*\.jsx$/, /.*\.tsx$/], // Aplica la ofuscación a todos los archivos relevantes
      exclude: [/node_modules/, /test/], // Excluye node_modules y posibles carpetas de pruebas
      apply: "build", // Aplica solo durante la construcción
      options: {
        compact: true, // Minimiza el código
        debugProtection: true, // Deshabilita depuración
        disableConsoleOutput: true, // Desactiva las salidas de consola
        identifierNamesGenerator: "mangled", // Nombres ofuscados más compactos
        renameGlobals: true, // Cambia los nombres globales
        selfDefending: false, // Protege contra modificaciones
        splitStrings: false, // Divide cadenas largas
        stringArray: true, // Convierte cadenas a arrays
        stringArrayEncoding: ["rc4"], // Codifica cadenas en base64
        stringArrayThreshold: 0.3, // Aplica 100% de transformación de cadenas
        transformObjectKeys: false, // Cambia los nombres de las claves de los objetos
        unicodeEscapeSequence: false, // Codifica cadenas como secuencias Unicode
      },
    }),
  ],
  build: {
    outDir: "build", // Cambia la carpeta de salida a "build"
    sourcemap: false, // No generar mapas de origen
    minify: "terser", // Usa Terser para minimizar
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("src/PresentationLayer/GenericComponents")) {
            console.log("Matched:", id);
            return "gnCmp";
          }

          if (id.includes("node_modules")) {
            return "vendor";
          }
        },
      },
    },
    terserOptions: {
      compress: {
        drop_console: true, // Elimina console.log
        drop_debugger: true, // Elimina debugger
      },
      format: {
        comments: false, // Elimina comentarios
      },
    },
    chunkSizeWarningLimit: 2000,
  },
  base: "/", // Base de la app
});
