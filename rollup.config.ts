import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';

export default {
    input: 'src/index.ts',
    output: [{
        file: 'dist/omg.js',
        format: 'esm',
    }],
    plugins: [
        resolve({}),
        commonjs({}),
        typescript({
            include: ['src/**'],
        }),
    ],
    external: [/node_modules/],
};
