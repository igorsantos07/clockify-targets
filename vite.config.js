import devtoolsJson from 'vite-plugin-devtools-json'
import { sveltekit } from '@sveltejs/kit/vite'
import { createFilter, defineConfig } from 'vite'
import { transformAsync } from '@babel/core'
import babelPlugins from './babel.plugins.js'

/**
 * Compiles the Babel proposals we use (see babel.plugins.js) in our own JS files.
 * Replaces vite-plugin-babel, which doesn't support Babel 8 (ESM-only, no default export).
 * Only src/ is processed: no lib uses those proposals, and running huge libs like Firestore through Babel is slow.
 */
function babelProposals() {
	const filter = createFilter('src/**/*.js')
	return {
		name   : 'babel-proposals',
		enforce: 'pre', //before Vite's own parsing, which doesn't know about these proposals
		async transform(code, id) {
			if (!filter(id)) return
			const result = await transformAsync(code, {
				filename  : id,
				babelrc   : false,
				configFile: false,
				plugins   : babelPlugins,
				sourceMaps: true,
			})
			return { code: result.code, map: result.map }
		},
	}
}

export default defineConfig({
	plugins: [
		sveltekit(),
		babelProposals(),
		devtoolsJson(),
	],
	css: {
		preprocessorOptions: {
			scss: {
				api: 'modern-compiler',
				//Bootstrap 5 still relies on @import and global Sass functions; these go away only with Bootstrap 6
				quietDeps          : true,
				silenceDeprecations: ['import', 'global-builtin', 'color-functions', 'if-function'],
			},
		},
	},
})
