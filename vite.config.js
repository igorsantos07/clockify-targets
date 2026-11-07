import devtoolsJson from 'vite-plugin-devtools-json'
import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'
import babel from 'vite-plugin-babel'

export default defineConfig({
	plugins: [
		sveltekit(),
		babel({ babelConfig: {
			babelrc   : false, //https://github.com/owlsdepartment/vite-plugin-babel#tips
			configFile: false,
			plugins   : [
				['@babel/plugin-proposal-pipeline-operator', { proposal: 'hack', topicToken: '#' }],
				'@babel/plugin-proposal-throw-expressions',
			],
		}}),
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
