<script>
import { Card, CardHeader, CardTitle, Col, ListGroup, ListGroupItem, Row } from '@sveltestrap/sveltestrap'
import { colorScaleFor } from '$lib/fmt'
import { _store } from '$data/_store'
import Settings from '$data/models/Settings'
import Period from '$data/Period'
import Days from '$data/Days'
import TimeBadge from '$cmp/TimeBadge.svelte'
import NonBillableAlert from './NonBillableAlert.svelte'
import SummaryTable from './SummaryTable.svelte'
import ProgressBars from './ProgressBars.svelte'
import CornerButtons from './CornerButtons.svelte'

export let billable    = 0
export let nonBillable = 0
export let start, end
export let title

const settings      = _store.settings
const workedSecs    = billable + nonBillable
const period        = new Period(title, start, end)
const considerToday = $settings.shouldConsiderToday

//so we can read+subscribe in this own component
const targetHours = period.target
const daysOff     = period.daysOff

/** @type Days */ const daysLeft = new Days(new Date(), end, considerToday)

//for some reason, just using $: is not working anymore in front of those variables? not sure if caused by change on where the stores are defined (moved from here to the model files), or by upgrading Svelte
let targetSecs, leftSecs, perDays, perDaysTarget
$: {
	targetSecs = $targetHours * 60 * 60
	leftSecs   = targetSecs - workedSecs
	//TODO use user.settings.myStartOfDay
	perDays    = { //if any value ends up as a division-by-zero, that results in Infinity and gets hidden
		7: leftSecs / Math.max(daysLeft.total - $daysOff, 1),
		6: leftSecs / (daysLeft.total - daysLeft.sundays - $daysOff),
		5: leftSecs / (daysLeft.total - daysLeft.weekendDays - $daysOff),
	}
	perDaysTarget = perDays[parseInt($settings.schedule.colorize)]
}

function selectWorkingDays(days) {
	switch (parseInt($settings.schedule.colorize)) {
		case 7: return days.total
		case 6: return days.weekdays + days.saturdays
		case 5: return days.weekdays
	}
}
</script>

<Card>
	<CardHeader class={`bg-scale-${colorScaleFor(perDaysTarget)}`}>
		<Row>
			<Col>
				<CardTitle>{title}</CardTitle>
			</Col>
			<Col xs="auto" class="side-btn">
				<CornerButtons bind:daysOff={period.daysOff} bind:target={period.target}/>
			</Col>
		</Row>
	</CardHeader>

	<ListGroup>
		<NonBillableAlert {nonBillable}/>

		<ListGroupItem class="pb-0">
			<SummaryTable daysOff={period.daysOff} {daysLeft} {targetSecs} {leftSecs} {workedSecs}/>
		</ListGroupItem>

		<ListGroupItem class="p-0">
			{#key $targetHours}<!-- wasn't needed before as well... same with period.target using $inside ProgressBars -->
				<ProgressBars {perDaysTarget} hours={$targetHours} {workedSecs}
			                total={selectWorkingDays(period.days)} left={selectWorkingDays(daysLeft)}/>
			{/key}
		</ListGroupItem>

		<ListGroupItem>
			<table>
				{#each Settings.AVG_OPTIONS as { n, color, badge, label }}
					{@const doable = isFinite(perDays[n])}
					<tr class:d-none={!$settings.schedule.show.includes(n)}>
						<th class={!doable? 'text-decoration-line-through text-muted' : null}>
							<span class={doable? `text-${color}` : 'text-muted'}>{badge}</span>
							{label || 'Needed hours per day'}
						</th>
						<td>{#if doable}<TimeBadge seconds={perDays[n]}/>{/if}</td>
					</tr>
				{/each}
			</table>
		</ListGroupItem>
	</ListGroup>
</Card>
