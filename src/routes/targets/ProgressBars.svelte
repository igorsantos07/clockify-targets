<style>
:global(.list-group-item .progress:first-of-type) { height: 1.5rem }
:global(.list-group-item .progress:last-of-type) { height: .5rem }
</style>

<script>
import { pct, colorScaleFor } from '$lib/fmt'
import { s2h } from '$lib/date'
import { Progress, Tooltip } from 'sveltestrap'

const SMALL_PROGRESS_BAR = 0.15
export let workedSecs, targetH, perDaysTarget, totalDays, daysLeft, idGen

const pctDone     = s2h(workedSecs) / $targetH
const pctExpected = (totalDays - daysLeft) / totalDays
const diff        = pctDone - pctExpected
</script>

<Progress animated id={idGen('progress')} class={`bg-scale-${colorScaleFor(perDaysTarget)}`} value={pctDone * 100}>
	{s2h(workedSecs) / $targetH > SMALL_PROGRESS_BAR? colorScaleFor(perDaysTarget, true) : '!!'}
</Progress>
<Tooltip target={idGen('progress')} placement="top">
	You've worked <b><tt>{pct(pctDone)}</tt></b> of your current target
</Tooltip>

<Progress striped id={idGen('expected')} color={diff >= 0? 'success' : 'danger'} value={pctExpected * 100}/>
<Tooltip target={idGen('expected')} placement="bottom">
	{#if diff >= 0}
		Yay! You are <b><tt>{pct(Math.abs(diff))}</tt></b> ahead of your target! 👏
	{:else}
		Hmm... You're <b><tt>{pct(Math.abs(diff))}</tt></b> behind. Godspeed, <i>literally</i> 🍀
	{/if}
</Tooltip>
