module.exports = {
	root: true,

	extends: [
		'eslint:recommended',
		'plugin:svelte/recommended',
	],

	overrides: [{ files: ['*.svelte'], processor: 'svelte/svelte' }],

	settings: {
		svelte: {
			kit: {
				alias: {
					$cmp : 'src/cmp',
					$data: 'src/data',
					'~'  : 'node_modules',
				},
			},
		},
	},

	parserOptions: {
		sourceType : 'module',
		ecmaVersion: 2020,
	},

	env: {
		browser: true,
		es2017 : true,
		node   : true,
	},

	reportUnusedDisableDirectives: true,

	rules: {
		// 'a11y-positive-tabindex': 'off',
		'svelte/valid-compile'  : 'off', //seems to allow us to skip a11y-positive-tabindex properly?
		'no-mixed-spaces-and-tabs': ['error', 'smart-tabs']
	},
}
