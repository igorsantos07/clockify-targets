import { derived } from 'svelte/store'
import { store } from '../store.js'

export default class Auth {

	#keyPersistor() {
		return store.API_KEY
	}

	get key() {
		return this.#keyPersistor()
	}

	set key(key) {
		this.#keyPersistor().update(key)
	}

	get $isAuth() {
		return derived(this.key, $key => !!$key)
	}
}
