<script>
import { s2d } from '$lib/date'
import { colorScaleFor } from '$lib/fmt'
import { Badge } from 'sveltestrap'

export let daysLeft
export let seconds
const MAX_WORK_PER_DAY = (24 - 8 - 2) * 60*60 //8 hours to sleep, 2 to live

</script>
{#if daysLeft > 2 && seconds <= MAX_WORK_PER_DAY}
	<Badge pill class={`bg-scale-${colorScaleFor(seconds)}`}>
		{s2d(seconds)} - {colorScaleFor(seconds, true)}
	</Badge>
{:else}
	<Badge pill color="dark" class="text-danger">NO CAN DO ({(seconds/60/60).toFixed(1)}h)</Badge>
{/if}
