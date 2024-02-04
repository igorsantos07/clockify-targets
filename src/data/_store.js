import { persisted as basePersisted } from 'svelte-local-storage-store'
import { writable as memoryPersistance } from 'svelte/store'
import * as devalue from 'devalue'

import User from './models/User'
import Settings from './models/Settings'
const MODEL_LIST = [User, Settings]
		.map(model => [model._TYPE, model])
		|>Object.fromEntries(#)

export { get } from 'svelte/store'

export const generalPersistance = (key, initial) => basePersisted(key, initial, { serializer: devalue })
const modelPersistance   = (key, initial) => basePersisted(key, initial, {
	serializer: {
		parse    : json => {
			switch (json) {
				case 'UNDEF':
					return undefined
				case 'NULL' :
					return null
				default:
					const { t: type, d: data } = JSON.parse(json)
					if (!MODEL_LIST.hasOwnProperty(type)) {
						//for some very odd reason, this was causing Svelte issues with `this` on a component??
						throw new Error(`Impossible to unserialize '${type}': it's not even present on MODEL_LIST!`)
					}
					const instance = new MODEL_LIST[type]
					instance.fill(data)
					return instance
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
	/** @type SvelteStore<Settings> */
	settings: modelPersistance('settings', new Settings),
	/** @type SvelteStore<?User> */
	user: modelPersistance('user', undefined),
}
