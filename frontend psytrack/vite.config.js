import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Define la ruta base para tus archivos estáticos.
// Esto debe coincidir con la ruta en la que Django sirve los archivos estáticos.
const staticBase = '/static/'

export default defineConfig({
  plugins: [react()],

  // Configura la salida de los archivos generados por Vite.
  build: {
    manifest: true,
    outDir: 'dist', // Directorio donde se generarán los archivos estáticos de React
    assetsDir: './assets', // Directorio donde se almacenarán los assets (CSS, JS, imágenes, etc.)
  },

  // Configura Vite para generar rutas relativas.
  base: './',

  // Configura el servidor de desarrollo para proxy inverso a Django.
  server: {
    proxy: {
      '/': 'http://localhost:8000', // Cambia la URL base según la configuración de tu servidor Django
    },
  },
})