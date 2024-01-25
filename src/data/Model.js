/**
 * @abstract
 */
export default class Model {

	static #IGNORED_PROPS = {
		User: ['defaultWorkspace','customFields','memberships','status']
	}

	/**
	 * @param props {object}
	 */
	constructor(props = undefined) {
		if (this.constructor == Model) {
			throw new Error('Model is an abstract class, dumbass')
		}

		if (props) {
			this.fill(props)
		}
	}

	/**
	 * Must be reimplemented in every freaking class, because JS OO is too weak.
	 * We also can't rely on `this.constructor.name` because of minification.
	 * 1. grab data from store
	 * 2. shove into a newly instantiated instance
	 * 3. return
	 * @abstract
	 */
	static async fromStore() {}

	fill(props) {
		if (props.hasOwnProperty('data')) { //damn, this came directly from Axios
			props = props.data
		}

		const filteredProps = Object.entries(props)
			.filter(([key]) => !Model.#IGNORED_PROPS[this.constructor.name]?.includes(key))

		Object.assign(this, Object.fromEntries(filteredProps))
	}
}
