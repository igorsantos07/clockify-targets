<script>
import { s2d } from '$lib/date.js'
import { s2$ } from '$lib/fmt.js'
import { Alert, ListGroupItem } from 'sveltestrap'

export let nonBillable
</script>

{#if nonBillable}
	<ListGroupItem class="p-0 border-0">
		<Alert color="danger" class="mb-0 border-0">
			You got {s2d(nonBillable)} ({s2$(nonBillable)}) of <b>non-billable time</b>!
		</Alert>
	</ListGroupItem>
{/if}
