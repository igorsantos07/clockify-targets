import { persisted as local } from 'svelte-local-storage-store'
import { writable as inMemory } from 'svelte/store'
import { addDoc, collection, doc, setDoc, getDoc, getDocs, query, where } from 'firebase/firestore'
import User from './User'
import Settings from './Settings'
import { DB } from '$lib/firebase.js'
import { get as baseGet } from 'svelte/store'

export const get = baseGet

const SINGLETONS = {}

const KEYS = {
	SETTINGS: 'settings',
	USER: 'user',
}

//"losely" inspired in svelte-persisted-store
//there are only two firestore packages for Svelte; one doesn't work with SSR=false and the other is not even properly documented... gave up and made my own lol
//FIXME this should probably be a store that saves data back to firestore, but doesn't bring it back - this is a responsibility of +layout.js:load(). Not sure what will be done of Target or History data, though...
const firestore = (key, initial, isSingleton = false) => {

	if (isSingleton && SINGLETONS[key]) {
		console.log(`Grabbing store singleton for ${key}`)
		return SINGLETONS[key]
	}

	/**
	 * @param key {string}
	 * @param value
	 */
	function push(key, value) {
		if (value) { //TODO what to do when we're cleaning up the local store / logging out the user?
			console.log(`Should sync {${key}} with Firestore`, value)
			return (key.split('/').length % 2) == 0 ?  // users/123 has ID, but users/123/photos don't
					setDoc(doc(DB, key), value) :
					addDoc(collection(DB, key), value)
		} else {
			console.log('Did not sync with Firestore because the value stored is undefined')
		}
	}

	//creates the usual in-memory store and augments it with Firestore sync capabilities
	const store = inMemory(initial)
	const { subscribe, set } = store

	//tries to load initial data from Firestore and updates the store once it arrives
	console.log(`Should load {${key}} from Firestore`)

	const entry = {
		subscribe,
		set: value => {
			set(value)
			push(key, value) //FIXME send data to Firestore? maybe remove push() and trottle API calls directly here?
		},
		update: callback => {
			if (!this.hasId()) {
				throw new Error('No ID to update the document!', this)
			}
			return store.update(last => {
				const value = callback(last)
				push(key, value) //FIXME check the difference between set and update!
				return value
			})
		}
	}
}

export const _store = {
	API_KEY : local('API_KEY', null),
	loading : inMemory(false),

/******** HERE BE "local cache" for smart subscriptions around the app ********/

	/** @type SvelteStore<Settings> */
	settings: local(KEYS.SETTINGS, new Settings), //always contains default data

	/** @type SvelteStore<?User> */
	user    : local(KEYS.USER), //no user = not logged in
}
