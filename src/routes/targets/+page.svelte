<script>
	import { s2d } from '$lib/date'
	import { s2$ } from '$lib/fmt'
	import { Alert } from 'sveltestrap'
	import TargetCard from './TargetCard.svelte'

	/** @type {{billable:number, nonBillable:number}} */
	export let data
</script>

{#if data.nonBillable}
	<Alert color="danger" class="mt-n3">
		You got {s2d(data.nonBillable)} ({s2$(data.nonBillable)}) of <b>non-billable time</b>!
	</Alert>
{/if}

<TargetCard workedHours={data.billable + data.nonBillable}/>
