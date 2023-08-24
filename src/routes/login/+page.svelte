<script>
import { Button, Card, CardBody, CardFooter, CardHeader, CardTitle, FormText, Icon } from 'sveltestrap'
import Auth from '$lib/Auth.js'
import { get } from 'svelte/store'
import Linput from '$cmp/Linput.svelte'

const auth = new Auth()
const key = auth.key
let localKey = get(key)

function doSave() {
	$key = localKey
}
function doClear() {
	$key = localKey = undefined
}
</script>

<Card>
	<CardHeader>
		<CardTitle>Clockify API</CardTitle>
	</CardHeader>
	<CardBody>
		<p>First, you need to get your API key from Clockify, so we can talk to it and start doing the math for you <Icon name="emoji-smile"/></p>

		<!-- TODO can't make this lg... -->
		<Linput label="API Key" bind:value={localKey} autofocus tabindex=1 required maxlength=48 minlength=48 />
		<FormText>
			Grab this at the bottom of your <a href="https://app.clockify.me/user/settings" target="_blank" tabindex=4>Profile Settings</a>.
		</FormText>
	</CardBody>
	<CardFooter class="text-end">
		<Button color="secondary" on:click={doClear} tabindex=3><Icon name="box-arrow-right"/> Clear that and log out</Button>
		<Button color="primary" on:click={doSave} tabindex=2><Icon name="box-arrow-in-left"/> Let me in!</Button>
	</CardFooter>
</Card>
