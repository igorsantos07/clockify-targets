<script>
import { s2d } from '$lib/date'
import { colorScaleFor } from '$lib/fmt'
import { Badge } from '@sveltestrap/sveltestrap'
import { _store } from '$data/_store'

export let seconds
let klass = ''; export { klass as class }
const settings = _store.settings
</script>

{#key $settings.schedule.maxDailyHours}
	<Badge pill class={`py-2 bg-scale-${colorScaleFor(seconds)} ${klass}`}>
		{s2d(seconds)} - {colorScaleFor(seconds, true)}
	</Badge>
{/key}
