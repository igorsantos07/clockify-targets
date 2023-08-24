import { persisted as basePersisted } from 'svelte-local-storage-store'
import * as devalue from 'devalue'

const persisted = (key, initial) => basePersisted(key, initial, { serializer: devalue })

export const store = {
	API_KEY: persisted('API_KEY', '')
}
