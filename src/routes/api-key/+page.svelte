<script>
import { Button, Card, CardBody, CardFooter, CardHeader, CardTitle, Icon } from '@sveltestrap/sveltestrap'
import Auth from '$lib/Auth.js'
import { _store, get } from '$data/_store'
import User from '$data/models/User'
import Linput from '$cmp/Linput.svelte'
import API from '$lib/API'
import Page from '$data/models/Page.js'

Page.init('API key & login', 'login')

const auth   = new Auth()
const isAuth = auth.$isAuth
const key    = auth.key
let localKey = get(key)

async function doSave() {
	$key       = localKey
	const data = await API.get('user')
	_store.user.set(new User(data)) //no $user because we don't need to subscribe to it here
}

function doClear() {
	$key = localKey = undefined
	_store.user.set(undefined)
}
</script>

<Card>
	<form on:submit|preventDefault={doSave}>
		<CardHeader>
			<CardTitle>Clockify API</CardTitle>
		</CardHeader>
		<CardBody>
			<p>First, you need to get your API key from Clockify, so we can talk to it and start doing the math for you <Icon name="emoji-smile"/></p>

			<Linput label="API Key" bind:value={localKey} size="lg" fullWidth autofocus tabindex="1" required maxlength="48" minlength="48">
				<svelte:fragment slot="help">
					Grab this at the bottom of your <a href="https://app.clockify.me/user/settings" target="_blank" tabindex="4">Profile Settings</a>.
				</svelte:fragment>
			</Linput>
		</CardBody>
		<CardFooter class="text-end">
			<Button color="secondary" type="button" on:click={doClear} tabindex="3">
				<Icon name="box-arrow-right"/> Clear that and log out
			</Button>
			<Button color="primary" type="submit" on:click={doSave} tabindex="2">
				<Icon name="box-arrow-in-left"/> {#if $isAuth}save{:else}Let me in!{/if}
			</Button>
		</CardFooter>
	</form>
</Card>
