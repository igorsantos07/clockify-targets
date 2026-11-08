/**
 * Babel proposals used in our own code (src/**\/*.js only; Svelte files don't go through Babel).
 * Shared by vite.config.js (to compile) and eslint.config.js (to parse), so both always agree.
 */
export default [
	['@babel/plugin-proposal-pipeline-operator', { proposal: 'hack', topicToken: '#' }],
	'@babel/plugin-proposal-throw-expressions',
]
