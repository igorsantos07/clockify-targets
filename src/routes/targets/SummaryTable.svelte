<script>
import { s2d } from '$lib/date'
import { s2$ } from '$lib/fmt'
import plur from 'plur'
import { Tooltip } from 'sveltestrap'
import Muted from '$cmp/Muted.svelte'
import { _store } from '$data/_store'

export let idGen
export let workedHours
export let weekendCount
export let daysOff, daysLeft
export let targetSecs, leftSecs

const settings = _store.settings
$: showOff = !$settings.hideMoney
/** A hackish variable to be used with {#key} on values related to these properties */
$: moneyUpdaterKey = $settings.hourlyRate + $settings.currency + $settings.exchange.rate + $settings.exchange.fee
</script>
<table>
	<tr>
		<td colspan="2">
			<big>
				<b><tt>{s2d(workedHours)}</tt></b> so far
				{#if showOff}
					{#key moneyUpdaterKey}
						<Muted>({s2$(workedHours)} out of {s2$(targetSecs)})</Muted>
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
			<span id={idGen('days-desc')} class="hover-help">{daysLeft} {plur('day', daysLeft)}</span>
			<Muted>
				(<span class="d-none d-sm-inline">with </span>{weekendCount.weekends? weekendCount.weekends : 'no'} {plur('weekend', weekendCount.weekends)}{#if $daysOff}&nbsp;+ {$daysOff} {plur('day', $daysOff)} off{/if})
			</Muted>

			<Tooltip target={idGen('days-desc')}>
				<ul class="mb-0 text-start ps-3">
					<li><b>{weekendCount.weekdays}</b> {plur('weekday', weekendCount.weekdays)}</li>
					<li><b>{weekendCount.saturday}</b> {plur('Saturday', weekendCount.saturday)}</li>
					<li><b>{weekendCount.sunday}</b> {plur('Sunday', weekendCount.sunday)}</li>
					<li><b>{$daysOff || 'no'}</b> {plur('day', $daysOff)} off</li>
				</ul>
			</Tooltip>
		</td>
	</tr>
</table>
