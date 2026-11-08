import devtoolsJson from 'vite-plugin-devtools-json'
import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'

export default defineConfig({
	plugins: [
		sveltekit(),
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
