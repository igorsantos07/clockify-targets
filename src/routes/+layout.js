import { _store, get } from '$data/_store.js'
import { redirect } from '@sveltejs/kit'
import User from '$data/User.js'
import { doc, getDoc, getDocs, query, where } from 'firebase/firestore'
import { DB } from '$lib/firebase.js'
import Settings from '$data/Settings.js'

export const ssr = false //TODO start using SSR, but first we need to wrap localStorage needs

export async function load({ route }) {

	let user, settings = new Settings()
	const apiKey = get(_store.API_KEY)
	/*
	 * CODIGO MOVIDO DO _STORE.JS... e mesmo assim, continua crashando o dev server, mesmo com a build "funcionando"... só que é muito dificil de entender os erros na build. desisti.
	 * FIXME o problema aqui é o ovo e a galinha...
	 *  pra carregar as configs, precisa do user. pra carregar o user, precisa da chave da API... pra carregar a chave da API, precisa da store, e a store precisa da definição da firestore.
	 *  Considerando que user e settings sao singletons, talvez valha mais a pena deixar isso FORA da store no geral e carregar eles diretamente no loader do layout principal, fazendo só a store básica do API key e deixando esses singletons fora do _store.js, sendo entidades separadas mesmo
	 */

	//TODO later on we either try to cache this in localStorage... or just depend on Firestore's caching/offline capabilities?

	if (apiKey) {
		const userResult = await getDocs(query(User.collection, where('apiKey', '==', apiKey)))
		if (userResult.size == 1) {
			user = new User(userResult.docs[0].data())
		}
		if (userResult.size > 1) { //sanity check
			throw new Error('WTF, more than one user for the same apiKey??')
		}

		if (user) {
			const settingsResult = await getDoc(doc(DB, `settings/${user.id}`))
			if (settingsResult) {
				settings = new Settings(settingsResult.data())
			}
		}
	}





	if ((!apiKey || !user) && route.id != '/api-key') {
		redirect(302, '/api-key')
	}

	return { settings, user }
}
