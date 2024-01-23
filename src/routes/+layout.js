import { _store, get } from '$data/_store.js'
import { redirect } from '@sveltejs/kit'
import Auth from '$lib/Auth.js'

export const ssr = false //TODO start using SSR, but first we need to wrap localStorage needs

export function load({ route }) {
	if ((!(new Auth().$isAuth) || !get(_store.user)) && route.id != '/api-key') {
		redirect(302, '/api-key')
	}
	return {}
}
