import adapter from '@sveltejs/adapter-static'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			/** the build folder */
			pages: 'build',

			// assets: 'build', //defaults to the value of `pages`

			/**
			 * Where to fall back to when you don't request a specific route - AKA the SPA container.
			 * This must be the same given to firebase.json:hosting.rewrites.destination.
			 */
			fallback: 'index.html',

			/** creates brotli and gzip files instead of readable code */
			precompress: false,

			/** refuses to build if some page seems to be missing */
			strict: true,
		}),
		alias  : {
			$cmp : 'src/cmp',
			$data: 'src/data',
			'~'  : 'node_modules',
		},
	},
}

export default config
