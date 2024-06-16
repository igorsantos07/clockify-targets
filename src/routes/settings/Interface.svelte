<script>
import { Card, CardHeader, CardTitle, ListGroup, ListGroupItem } from '@sveltestrap/sveltestrap'
import { _store } from '$data/_store'
import Linput from '$cmp/Linput.svelte'

const settings = _store.settings
</script>

<Card>
	<CardHeader>
		<CardTitle>🖼️ Interface</CardTitle>
	</CardHeader>
	<ListGroup flush>
		<ListGroupItem>
			<Linput type="switch" bind:checked={$settings.ui.animate} label="Animate progress bars"/>

			<Linput type="switch" bind:checked={$settings.ui.money}
			        label="Show monetary values"
			        help="The same as the 🙈/🤑 at the header"/>
		</ListGroupItem>
	</ListGroup>
</Card>
