<style>
:global(#hour-calc) {
		width: 210px; /* enough for the 24H time + "tomorrow" flag */
}

/* just enough for 3 digits + the browser's spinner (content-box, so Bootstrap's padding comes on top of it) */
:global(#hour-calc input) {
	flex: 0 0 auto;
	box-sizing: content-box;
	width: calc(3.5ch + 1rem);
}
</style>

<script>
import { onDestroy } from 'svelte'
import { addMinutes, differenceInCalendarDays } from 'date-fns'
import { Input, InputGroup, InputGroupText, NavLink, Popover } from '@sveltestrap/sveltestrap'
import plur from 'plur'
import { idGenerator } from '$lib'
import { _store } from '$data/_store'

const idGen    = idGenerator()
const settings = _store.settings

let now   = new Date()
let hours = 1

//ticks right at the turn of each minute, so the clock never lags behind the system one
let timer = setTimeout(function tick() {
	now   = new Date()
	timer = setTimeout(tick, 60_000 - (now.getSeconds() * 1000 + now.getMilliseconds()))
}, 60_000 - (now.getSeconds() * 1000 + now.getMilliseconds()))
onDestroy(() => clearTimeout(timer))

$: fmt     = new Intl.DateTimeFormat([], $settings.ui.hour12?
	{ hour: 'numeric', minute: '2-digit', hourCycle: 'h12' } :
	{ hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
$: amount  = parseFloat(hours) || 0 //sveltestrap's Input gives back strings, even for type=number
$: result  = addMinutes(now, amount * 60)
$: dayDiff = differenceInCalendarDays(result, now)
</script>

<NavLink id={idGen('calc')} class="emoji">🧮</NavLink>
<Popover target={idGen('calc')} id="hour-calc" placement="bottom" title="🐴 Are we there yet?">
	<p class="mb-2">It is <tt>{fmt.format(now)}</tt> now...</p>
	<InputGroup>
		<InputGroupText>+</InputGroupText>
		<Input class="hours-input" bind:value={hours} type="number" step="0.5" min="1" max="12" title="Add hours"/>
		<InputGroupText>{plur('hour', amount)}</InputGroupText>
	</InputGroup>
	<p class="mt-2 mb-0">
		Leave at
		<b><tt>{fmt.format(result)}</tt></b>
		{#if dayDiff}<small class="text-muted">{dayDiff == 1? '(tomorrow)' : ''}</small>{/if}
	</p>
</Popover>
