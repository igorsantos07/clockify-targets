import { persisted as basePersisted } from 'svelte-persisted-store'
import { writable as memoryPersistance } from 'svelte/store'
import * as devalue from 'devalue'

import User from './models/User'
import Settings from './models/Settings'
import Page from '$data/models/Page.js'
const MODEL_LIST = Object.fromEntries(
	[User, Settings].map(model => [model._TYPE, model])
)

export { get } from 'svelte/store'

export const generalPersistance = (key, initial) => basePersisted(key, initial, { serializer: devalue })
/**
 * Same as {@link generalPersistance}, but forcing the value with {@link parseInt}
 * @param key {string}
 * @param initial {number}
 * @returns {SvelteStore<number>}
 */
export const intPersistance = (key, initial) => {
	//svelte-persisted-store returns the same cached instance for a given key, so we must not mutate it:
	//re-wrapping its `set` on every call (e.g. each time a page is mounted) made it recurse into itself
	const store = basePersisted(key, initial, { serializer: devalue })
	return {
		...store,
		set: v => store.set(parseInt(v)),
	}
}

const modelPersistance = (key, initial) => basePersisted(key, initial, {
	serializer: {
		parse    : json => {
			switch (json) {
				case 'UNDEF':
					return undefined
				case 'NULL' :
					return null
				default: {
					const { t: type, d: data } = JSON.parse(json)
					if (!Object.hasOwn(MODEL_LIST, type)) {
						//for some very odd reason, this was causing Svelte issues with `this` on a component??
						throw new Error(`Impossible to unserialize '${type}': it's not even present on MODEL_LIST!`)
					}
					const instance = new MODEL_LIST[type]
					instance.fill(data)
					return instance
				}
			}
		},
		stringify: obj => {
			if (typeof obj == 'undefined') { //mimicking devalue's support for undefined and friends
				return 'UNDEF'
			}
			if (obj === null) {
				return 'NULL'
			}
			return JSON.stringify({
				t: obj.constructor._TYPE ?? console.error('Trying to serialize object without `_TYPE` prop??', { obj }),
				d: obj, //becomes just its properties
			})
		},
	},
})

export const _store = {
	API_KEY: generalPersistance('API_KEY', ''),
	loading: memoryPersistance(false),
	/** @type SvelteStore<Page> */
	page: memoryPersistance(new Page),
	/** @type SvelteStore<Settings> */
	settings: modelPersistance('settings', new Settings),
	/** @type SvelteStore<?User> */
	user: modelPersistance('user', undefined),
}
