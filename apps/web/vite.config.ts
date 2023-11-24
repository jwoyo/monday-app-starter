import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import {vanillaExtractPlugin} from '@vanilla-extract/vite-plugin';
import dotenv from 'dotenv';
import {dirname, resolve} from 'path';
import {fileURLToPath} from 'url';
import * as process from 'process';
import basicSsl from '@vitejs/plugin-basic-ssl';

const __dirname = dirname(fileURLToPath(import.meta.url));
const webRootPath = resolve(__dirname);
const rootPath = resolve(webRootPath, '..', '..');

const environment = dotenv.config({
  path: resolve(rootPath, '.env'),
});

if (environment.error) {
  throw environment.error;
}

const isLocalDevServer = process.env.LOCAL_DEV_SERVER === 'true';

export default defineConfig({
  plugins: [react(), vanillaExtractPlugin(), basicSsl()],
  resolve: {
    alias: {
      'bridge': 'bridge/src',
      'functions': 'functions/src',
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    https: true,
    port: 5173,
  },
  define: {
    'import.meta.env.__FUNCTION_URL_CHECKLIST__': JSON.stringify(
            isLocalDevServer ?
                environment.parsed.FUNCTION_URL_CHECKLIST_LOCAL :
                environment.parsed.FUNCTION_URL_CHECKLIST
    ),
    'import.meta.env.__MONDAY_APP_CLIENT_ID__': JSON.stringify(environment.parsed.MONDAY_APP_CLIENT_ID),
    'import.meta.env.__MONDAY_APP_HOSTING_URL__': JSON.stringify(isLocalDevServer ? 'https://localhost:5173' : environment.parsed.MONDAY_APP_HOSTING_URL),
  },
});
