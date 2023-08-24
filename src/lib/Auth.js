import { derived } from 'svelte/store'
import { _store } from '../data/_store.js'

export default class Auth {
	get key() {
		return _store.API_KEY
	}

	set key(key) {
		_store.API_KEY.set(key)
	}

	get $isAuth() {
		return derived(this.key, $key => !!$key)
	}
}
