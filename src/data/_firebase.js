import { onMount } from 'svelte'
import { dev } from '$app/environment'
import { initializeApp as initializeFirebase } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getFirestore } from 'firebase/firestore'
import { getPerformance } from 'firebase/performance'
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from 'firebase/app-check'
import { onLCP, onFID, onCLS } from 'web-vitals/attribution'

let FIREBASE
export let ANALYTICS, DB, PERF

/**
 * Initializes Firebase config and its subsystems via {@link onMount}, since it seems to depend on `window` for some odd reason...
 * @constructor
 */
export const FIREBASE_INIT = () => {
	onMount(() => {
		// const obj = await import(“name-of-package”)

		FIREBASE = initializeFirebase({
			projectId    : 'clockify-targets',
			appId        : '1:327145547833:web:4e88c32847f907af4105e8',
			apiKey       : 'AIzaSyCptngMzR8j8WsCv81HL151qgjr3yEn580',
			measurementId: 'G-2HDBCTXBP9',
			// databaseURL      : 'https://clockify-targets-default-rtdb.firebaseio.com',
			// authDomain       : 'clockify-targets.firebaseapp.com',
			// storageBucket    : 'clockify-targets.appspot.com',
			// messagingSenderId: '327145547833',
		})

		ANALYTICS = getAnalytics(FIREBASE)
		DB        = getFirestore(FIREBASE)
		PERF      = getPerformance(FIREBASE)

		//TODO should we have a test key for dev use? I guess it's not needed, since there's this debug token thingie
		window.FIREBASE_APPCHECK_DEBUG_TOKEN = dev
		const APP_CHECK = initializeAppCheck(FIREBASE, {
		  provider: new ReCaptchaEnterpriseProvider('6LfbTlkpAAAAADMZMyD6geyj3WIPkJH-_pEJFQPK'),
		  isTokenAutoRefreshEnabled: true
		})

		//extra stuff that Performance Monitoring suggests
		onCLS(console.debug)
		onFID(console.debug)
		onLCP(console.debug)
	})
}
