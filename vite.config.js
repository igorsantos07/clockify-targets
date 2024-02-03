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
				'@babel/plugin-proposal-throw-expressions'
			]
		}})
	]
});
