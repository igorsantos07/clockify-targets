/**
 * @abstract
 */
export default class Model {

	static #IGNORED_PROPS = {
		User: ['defaultWorkspace','customFields','memberships','status']
	}

	/**
	 * Must be implemented by children classes with a plain `static TYPE = 'XYZ' with its name.
	 * This is to be used by the (de)serializer, since when minified we cannot trust `this.constructor.name`.
	 * @abstract
	 */
	static get _TYPE() {
		throw new Error('Implementing Models should have a static `_TYPE` prop')
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

	fill(props) {
		if (props.hasOwnProperty('data')) { //damn, this came directly from Axios
			props = props.data
		}

		const filteredProps = Object.entries(props)
			.filter(([key]) => !Model.#IGNORED_PROPS[this.constructor.name]?.includes(key))

		Object.assign(this, Object.fromEntries(filteredProps))
	}
}
