import { persisted as basePersisted } from 'svelte-local-storage-store'
import { writable as memoryPersistance } from 'svelte/store'
import * as devalue from 'devalue'

//these must stay so deserialization works properly!
// noinspection ES6UnusedImports
import User from './User'
import Settings from './Settings'

export { get } from 'svelte/store'

const generalPersistance = (key, initial) => basePersisted(key, initial, { serializer: devalue })
const modelPersistance = (key, initial) => basePersisted(key, initial, {
	serializer: {
		parse    : json => {
			switch (json) {
				case 'UNDEF':
					return undefined
				case 'NULL' :
					return null
				default:
					const { t: type, d: data } = JSON.parse(json)
					const instance = eval(`new ${type}`) //urgh
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
				t: obj.constructor.name,
				d: obj, //becomes just its properties
			})
		},
	},
})

export const _store = {
	API_KEY : generalPersistance('API_KEY', ''),
	loading : memoryPersistance(false),
	/** @type Settings */
	settings: modelPersistance('settings', new Settings({ hideMoney: true })),
	/** @type User */
	user: modelPersistance('user', undefined),
}
