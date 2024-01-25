import { onMount } from 'svelte'
import { browser, dev } from '$app/environment'
import { initializeApp as initializeFirebase } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { getPerformance } from 'firebase/performance'
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from 'firebase/app-check'
import { onLCP, onFID, onCLS } from 'web-vitals/attribution'

let FIREBASE
export let ANALYTICS, AUTH, DB, PERF

/**
 * Initializes Firebase config and its subsystems via {@link onMount}, since it seems to depend on `window` for some odd reason...
 * @constructor
 */
if (browser) {
	FIREBASE = initializeFirebase({
		projectId    : 'clockify-targets',
		appId        : '1:327145547833:web:4e88c32847f907af4105e8',
		apiKey       : 'AIzaSyCptngMzR8j8WsCv81HL151qgjr3yEn580',
		measurementId: 'G-2HDBCTXBP9',
		authDomain   : 'clockify-targets.web.app',
		// storageBucket    : 'clockify-targets.appspot.com',
		// messagingSenderId: '327145547833',
	})

	ANALYTICS = getAnalytics(FIREBASE)
	AUTH      = getAuth(FIREBASE)
	DB        = getFirestore(FIREBASE)
	// PERF      = getPerformance(FIREBASE) //FIXME makes the dev server hang VERY BAD when loading firestore data???

	if (dev) {
		connectAuthEmulator(AUTH, 'http://127.0.0.1:34732', { disableWarnings: true }) //adds a warning so you don't try to log in with prod user and gets baffled when that fails lol
		connectFirestoreEmulator(DB, '127.0.0.1', 34737)
	}

	//TODO should we have a test key for dev use? I guess it's not needed, since there's this debug token thingie
	window.FIREBASE_APPCHECK_DEBUG_TOKEN = dev
	initializeAppCheck(FIREBASE, {
	  provider: new ReCaptchaEnterpriseProvider('6LfbTlkpAAAAADMZMyD6geyj3WIPkJH-_pEJFQPK'),
	  isTokenAutoRefreshEnabled: true
	})

	//extra stuff that Performance Monitoring suggests
	onCLS(console.debug)
	onFID(console.debug)
	onLCP(console.debug)
}
