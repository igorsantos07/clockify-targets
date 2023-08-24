<script>
import API from '$lib/API.js'
import { Button, Card, CardBody, CardFooter, CardHeader, CardTitle, FormGroup, FormText, Input } from 'sveltestrap'

let key = window.localStorage.API_KEY || ''

function doSave() {
	window.localStorage.API_KEY = key

	console.log(API.get('user'))
}
</script>

<Card>
	<CardHeader>
		<CardTitle>Clockify API</CardTitle>
	</CardHeader>
	<CardBody>
		<FormGroup floating label="API Key"><!-- TODO can't make this lg... -->
			<Input bind:value={key} autofocus maxlength="48" minlength="48"/>
		</FormGroup>
		<FormText>
			Grab this at the bottom of your <a href="https://app.clockify.me/user/settings" target="_blank">Profile Settings</a>
		</FormText>
	</CardBody>
	<CardFooter class="text-end">
		<Button color="primary" on:click={doSave}>Save</Button>
	</CardFooter>
</Card>
