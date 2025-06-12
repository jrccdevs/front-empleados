import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 4001, // Puerto donde se ejecutará tu frontend (ajusta si es necesario)
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // <-- ¡AJUSTA ESTA URL A LA DE TU BACKEND!
                                        // Si tu backend usa el puerto 3000 (con Docker), déjalo así.
                                        // Si tu backend usa el puerto 3001 (sin Docker), cámbialo a 'http://localhost:3001'
        changeOrigin: true, // Necesario para solicitudes cross-origin
        secure: false,      // false para desarrollo (no necesitas SSL)
        // rewrite: (path) => path.replace(/^\/api/, ''), // Si tu backend no espera '/api' en la URL
                                                        // (La API que construimos sí lo espera, así que no descomentar)
      },
    },
  },
});