import axios from 'axios'
import { _store, get } from '$data/_store'
import User from '$data/User'

const API = axios.create({
	baseURL: 'https://api.clockify.me/api/v1/'
})

API.interceptors.request.use(config => {
	if (!navigator.onLine) {
		//TODO deal with this
		throw new axios.Cancel('offline')
	}

	const key = get(User.$API_KEY)
	if (!key) {
		throw new Error('API key not present')
	}
	config.headers['X-Api-Key'] = key

	_store.loading.set(true)
	return config
})

API.interceptors.response.use(
	data => {
		_store.loading.set(false)
		return data
	},
	e => {
		_store.loading.set(false)
		console.error('API whoops', e)
	}
)

export default API
