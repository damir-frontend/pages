import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  base: '/pages/', 
  plugins: [react()],
  resolve: {
    alias: {
		  '@app': path.resolve(__dirname, 'src/app'),
		  '@assets': path.resolve(__dirname, 'src/assets'),
    },
  },
});
