<script>
import API from '$lib/API.js'

let key = window.localStorage.API_KEY || ''
function doSave() {
	window.localStorage.API_KEY = key

	console.log(API.get('user'))
}
</script>

API Key:
<input bind:value={key}/>
<button on:click={doSave}>Save</button>
<em>Grab this at the bottom of your <a href="https://app.clockify.me/user/settings" target="_blank">Profile Settings</a></em>
