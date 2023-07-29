const esbuild = require('esbuild');
const { nodeExternalsPlugin } = require('esbuild-node-externals');

esbuild.build({
    entryPoints: ['src/index.ts'],
    bundle: true,
    outfile: 'dist/out.js',
    target: "node18",
    platform: "node",
    plugins: [nodeExternalsPlugin({allowList: ["bridge"]})],
}).catch(() => process.exit(1))
