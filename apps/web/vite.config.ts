import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import {vanillaExtractPlugin} from '@vanilla-extract/vite-plugin';
import dotenv from "dotenv"
import {dirname, resolve} from "path";
import {fileURLToPath} from "url";
import * as process from "process";


const __dirname = dirname(fileURLToPath(import.meta.url));
const webRootPath = resolve(__dirname);
const rootPath = resolve(webRootPath, "..", "..");

const environment = dotenv.config({
    path: resolve(rootPath, ".env.local")
})

if (environment.error) {
    throw environment.error
}

const isLocalDevServer = process.env.LOCAL_DEV_SERVER === "true";

export default defineConfig({
    plugins: [react(), vanillaExtractPlugin()],
    resolve: {
        alias: {
            bridge: "bridge/src",
        }
    },
    define: {
        "import.meta.env.__FUNCTION_URL_CHECKLIST__": JSON.stringify(
            isLocalDevServer ?
                environment.parsed.FUNCTION_URL_CHECKLIST_LOCAL :
                environment.parsed.FUNCTION_URL_CHECKLIST
        ),
    },
});