<script>
import { s2d } from '$lib/date'
import { s2$ } from '$lib/fmt'
import { idGenerator } from '$lib'
import plur from 'plur'
import { Tooltip } from '@sveltestrap/sveltestrap'
import Muted from '$cmp/Muted.svelte'
import { _store } from '$data/_store'

const idGen = idGenerator()

export let workedSecs
export let daysOff
export let targetSecs, leftSecs
/** @type Days */ export let daysLeft

const settings = _store.settings
$: showOff = !$settings.hideMoney
/** A hackish variable to be used with {#key} on values related to these properties */
$: moneyUpdaterKey = $settings.hourlyRate + $settings.currency + $settings.exchange.rate + $settings.exchange.fee

</script>

<table>
	<tr>
		<td colspan="2">
			<big>
				<b><tt>{s2d(workedSecs)}</tt></b> so far
				{#if showOff}
					{#key moneyUpdaterKey}
						<Muted>({s2$(workedSecs)} out of {s2$(targetSecs)})</Muted>
					{/key}
				{/if}
			</big>
		</td>
	</tr>
	<tr>
		<th>Hours left:</th>
		<td>
			<tt>{s2d(leftSecs)}</tt>
			{#if showOff}
				{#key moneyUpdaterKey}
					<Muted>({s2$(leftSecs)}!!!)</Muted>
				{/key}
			{/if}
		</td>
	</tr>
	<tr>
		<th>Days left:</th>
		<td>
			<span id={idGen('days-desc')} class="hover-help">{daysLeft.total} {plur('day', daysLeft.total)}</span>
			<Muted>
				(<span class="d-none d-sm-inline">with </span>{daysLeft.weekends? daysLeft.weekends : 'no'} {plur('weekend', daysLeft.weekends)}{#if $daysOff}&nbsp;+ {$daysOff} {plur('day', $daysOff)} off{/if})
			</Muted>

			<Tooltip target={idGen('days-desc')}>
				<ul class="mb-0 text-start ps-3">
					<li><b>{daysLeft.weekdays}</b> {plur('weekday', daysLeft.weekdays)}</li>
					<li><b>{daysLeft.saturdays}</b> {plur('Saturday', daysLeft.saturdays)}</li>
					<li><b>{daysLeft.sundays}</b> {plur('Sunday', daysLeft.sundays)}</li>
					<li><b>{$daysOff || 'no'}</b> {plur('day', $daysOff)} off</li>
				</ul>
			</Tooltip>
		</td>
	</tr>
</table>
