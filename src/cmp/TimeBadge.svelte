<script>
import { s2d } from '$lib/date'
import { colorScaleFor } from '$lib/fmt'
import { Badge } from 'sveltestrap'

export let seconds
</script>

<Badge pill class={`py-2 bg-scale-${colorScaleFor(seconds)}`}>
	{s2d(seconds)} - {colorScaleFor(seconds, true)}
</Badge>
