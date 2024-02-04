<style>
:global(.list-group-item .progress:first-of-type) { height: 1.5rem }
:global(.list-group-item .progress:last-of-type) { height: .5rem }
</style>

<script>
import { colorScaleFor, pct } from '$lib/fmt'
import { s2h } from '$lib/date'
import { idGenerator } from '$lib'
import { Progress, Tooltip } from '@sveltestrap/sveltestrap'

const idGen = idGenerator()
const SMALL_PROGRESS_BAR = 0.15
export let workedSecs, hours, perDaysTarget, total, left

const pctDone     = s2h(workedSecs) / hours
const pctExpected = (total - left) / total
const diff        = pctDone - pctExpected
const exceeded    = pctDone >= 1
</script>

<Progress animated id={idGen('progress')} value={pctDone * 100}
          class={!exceeded && `bg-scale-${colorScaleFor(perDaysTarget)}`} color={exceeded && 'success'}>
	{#if exceeded}
		<b>🔥 100% 🔥</b>
	{:else}
		{pctDone > SMALL_PROGRESS_BAR? colorScaleFor(perDaysTarget, true) : '!!'}
	{/if}
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
