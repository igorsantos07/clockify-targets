import js from '@eslint/js'
import svelte from 'eslint-plugin-svelte'
import globals from 'globals'
import babelParser from '@babel/eslint-parser'
import babelPlugins from './babel.plugins.js'
import svelteConfig from './svelte.config.js'

export default [
	{
		ignores: [
			'build/',
			'.svelte-kit/',
			'package/',
			'.playwright-mcp/',
			'.firebase/',
		],
	},

	js.configs.recommended,
	...svelte.configs.recommended,

	{
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType : 'module',
			globals    : { ...globals.browser, ...globals.node },
		},
		settings: {
			svelte: {
				kit: svelteConfig.kit, //reuses the aliases ($cmp, $data, ~) and anything else configured there
			},
		},
		linterOptions: {
			reportUnusedDisableDirectives: true,
		},
		rules: {
			'svelte/valid-compile'    : 'off', //seems to allow us to skip a11y-positive-tabindex properly?
			'no-mixed-spaces-and-tabs': ['error', 'smart-tabs'],
		},
	},

	{ //same files and proposals that vite-plugin-babel compiles, so lint understands e.g. |> pipelines
		files          : ['src/**/*.js'],
		languageOptions: {
			parser       : babelParser,
			parserOptions: {
				requireConfigFile: false,
				//no babelrc/configFile: false here, or the parser takes a shortcut that ignores `plugins`
				babelOptions     : { plugins: babelPlugins },
			},
		},
	},
]
