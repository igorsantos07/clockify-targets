import { derived, get } from 'svelte/store'
import { persisted } from 'svelte-local-storage-store'

export default class Auth {

	#keyPersistor() {
		return persisted('API_KEY', '')
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
