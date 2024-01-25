<script>
import { page } from '$app/stores'
import { Alert, Button, Card, CardBody, CardFooter, CardHeader, CardTitle, Icon } from '@sveltestrap/sveltestrap'
import { _store, get } from '$data/_store'
import User from '$data/User'
import Linput from '$cmp/Linput.svelte'
import Title from '$cmp/Title.svelte'
import { dev } from '$app/environment'
import { isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth'
import { AUTH } from '$lib/firebase.js'
import { goto } from '$app/navigation'

// /** @type {{ user: User }} */
// export let data
// const { user } = data
const user = _store.user
console.log({user, data: get(user)})

const key    = User.$API_KEY
const isAuth = !!$key
let localKey = get(key) //TODO why can't we just bind to $key?
let isConfirmPage = $page.url.searchParams.has('confirm')

if (isConfirmPage && isSignInWithEmailLink(AUTH, $page.url.href)) {
	if (user.email) {
		signInWithEmailLink(AUTH, user.email, $page.url.href)
				.then(result => {
					user.update({ confirmed: true })
					window.alert('Welcome!')
					console.log({result})
					goto('/')
				})
	} else {
		window.alert('It looks like you are not on the same device where you added your API key. Open the email link from the same browser where you started this.')
		//maybe we should show a box for the user to write the email, in case they're in another device...... although this kinda defeats the purpose of using the link sign up as a security measure against API Key stealing
		//FIXME or maybe it's possible to set a listener to auth, so when confirmed elsewhere this device will get the auth details??
	}
}


async function doSaveKey() {
	$key = localKey
	try {
		await User.signUp($key)
		window.alert('Thanks! You will receive a confirmation email; to finish the setup, open its link on this same browser. '+(dev? 'Actually... This is DEV MODE! Check the Firebase emulator logs instead!' : ''))
	} catch (e) {
		window.alert('An error occurred; try again later, sorry!')
		console.error(e)
		console.log(e)
	}
}

function doLogOut() {
	$key = localKey = ''
	_store.user.set(undefined)
	//signOut(AUTH).then... //FIXME call Firebase
}
</script>

<Title page="API key & login"/>

<Card>
	<form>
		<CardHeader>
			<CardTitle>Clockify API</CardTitle>
		</CardHeader>
		<CardBody>
			<Alert color="warning" fade heading="Unconfirmed email" isOpen={user && !user.confirmed}>
				Please, use this browser to open the link sent to your email.<br/>
				<small>We won't send emails other than when logging in - it's just a quick security measure for getting in Clockify Targets.</small>
			</Alert>

			<p>First, you need to get your API key from Clockify, so we can talk to it and start doing the math for you <Icon name="emoji-smile"/></p>

			<Linput label="API Key" bind:value={localKey} size="lg" fullWidth autofocus tabindex="1" required maxlength="48" minlength="48">
				<svelte:fragment slot="help">
					Grab this at the bottom of your <a href="https://app.clockify.me/user/settings" target="_blank" tabindex="4">Profile Settings</a>.
				</svelte:fragment>
			</Linput>
		</CardBody>
		<CardFooter class="text-end">
			<Button color="secondary" type="button" on:click={doLogOut} tabindex="3">
				<Icon name="box-arrow-right"/> Clear that and log out
			</Button>
			<Button color="primary" type="submit" on:click={doSaveKey} tabindex="2">
				<Icon name="box-arrow-in-left"/> {#if isAuth}Update{:else}Let me in!{/if}
			</Button>
		</CardFooter>
	</form>
</Card>
