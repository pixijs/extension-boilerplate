import path from 'path';
import esbuild from 'rollup-plugin-esbuild';
import pkg from './package.json' assert { type: 'json' };

/**
 * Modify this configuation your needs. There are very few
 * dependencies here, so if you need other options in this
 * Rollup configuration, see https://rollupjs.org/. 
 */
const userConfig = {
    /**
     * Global namespace for your vanilla JS export
     * Please do not use "PIXI", either choose another
     * namespace or something nested like "PIXI.foobar"
     */
    name: 'PIXI.plugin',
    /** List of external packages not to bundle */
    external: [
        '@pixi/core',
        '@pixi/display'
    ],
    /** Global namespaces for other vanilla JS export */
    globals: {
        '@pixi/core': 'PIXI',
        '@pixi/display': 'PIXI',
    },
};

export default [
    {
        // As of v7, PixiJS targets ES2020 for modules/bundlers
        plugins: [esbuild({ target: 'ES2020' })],
        external: userConfig.external,
        input: pkg.source,
        output: [
            {
                dir: path.dirname(pkg.main),
                entryFileNames: '[name].js',
                format: 'cjs',
                preserveModules: true,
                sourcemap: true
            },
            {
                dir: path.dirname(pkg.module),
                entryFileNames: '[name].mjs',
                format: 'esm',
                preserveModules: true,
                sourcemap: true
            }
        ],
    },
    {
        // As of v7, PixiJS targets ES2017 for browsers
        plugins: [esbuild({
            target: 'ES2017',
            minify: true,
        })],
        external: userConfig.external,
        input: pkg.source,
        treeshake: false,
        output: [
            {
                file: pkg.bundle,
                format: 'iife',
                name: userConfig.name,
                sourcemap: true,
                globals: userConfig.globals,
            }
        ],
    }
];