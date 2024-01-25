import Model from './Model'
import API from '$lib/API'
import { _store, get } from '$data/_store'
import { AUTH, DB } from '$lib/firebase'
import { sendSignInLinkToEmail, isSignInWithEmailLink } from 'firebase/auth'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { ENV_DOMAIN } from '$env/static/public'

/** @typedef ClockifySettings
 * @property {'MONDAY'|'SUNDAY'} weekStart
 * @property {string} timeZone
 * @property {'HOUR12'|'HOUR24'} timeFormat
 * @property {'LIGHT'|'DARK'} theme //TODO support light/dark themes automatically
 * @property {string} myStartOfDay Time in the format HH:MM
 */
/**
 * @property {string} id
 * @property {string} apiKey
 * @property {string} email
 * @property {string} name
 * @property {boolean} confirmed If the email was confirmed and the user is allowed to fully use the platform
 * @property {string} pic full URL
 * @property {ClockifySettings} clockifySettings
 * @property {{active: string, default: string}} workspaces
 */
export default class User extends Model {

	static get collection() {
		return collection(DB, 'users')
	}

	static async fromStore() {
		let data = get(_store.user)
		console.log('from Store', {data})
		if (data) {
			return new User(data)
		}

		let apiKey = get(User.$API_KEY)
		if (apiKey) {
			console.log(`Rehydrating from API Key ${apiKey}`)
			const results = await getDocs(query(User.collection, where('apiKey', '==', apiKey)))
			if (results.size == 1) {
				return new User(results.docs[0].data())
			}
			if (results.size > 1) { //sanity check
				throw new Error ('WTF, more than one user for the same apiKey??')
			}
		}

		return null
	}

	update(props) {
		_store.user.update(user => ({ ...props, ...user }))
	}

	get baseURL() {
		return `workspaces/${this.workspaces.active}/user/${this.id}/`
	}

	static get $API_KEY() {
		return _store.API_KEY
	}

	isAuth() {
		return !!(this.apiKey || get(User.$API_KEY))
	}

	static #setNormalized({ data }, apiKey = null, setId = false) {
		const normalized = {
			confirmed       : false, //FIXME do not show logged-in interface just yet
			id              : data.id,
			email           : data.email,
			name            : data.name,
			pic             : data.profilePicture,
			clockifySettings: data.settings,
			workspaces      : {
				active : data.activeWorkspace,
				default: data.defaultWorkspace,
			}
		}
		if (apiKey) {
			normalized.apiKey = apiKey
		}
		if (setId) {
			_store.user.setId(data.id)
			console.log(data.id)
		}
		_store.user.set(normalized)
	}

	/**
	 * @param apiKey {string}
	 * @returns {Promise<void>}
	 */
	static async signUp(apiKey) {
		_store.API_KEY.set(apiKey)
		const result = await API.get('user')
		//FIXME error handling should remove the API_KEY

		console.debug('Email link sent', { ENV_DOMAIN, email: result.data.email })

		//store all the data so when the user is back from the email, we don't need to re-request it all
		this.#setNormalized(result, apiKey, true)

		//the end link lands in /api-key?confirm &apiKey=ABC &oobCode=XYZ &mode=signIn &lang=en
		return sendSignInLinkToEmail(AUTH, result.data.email, {
			url: ENV_DOMAIN+'api-key?confirm',
			handleCodeInApp: true,
		})
	}
}
