import js from '@eslint/js'
import svelte from 'eslint-plugin-svelte'
import globals from 'globals'
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
]
