/**
 * Once ran in a component, will return a function which generates HTML IDs with the same random number.
 * Useful to link an action and a target element under the same prefix.
 * @returns {function(prefix:string): string}
 */
export function idGenerator() {
	const suffix = `id${Math.round(Math.random() * 100_000)}`
	return id => `${id}-${suffix}`
}
