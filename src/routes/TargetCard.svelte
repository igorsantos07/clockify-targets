<script>
import { Card, CardHeader, CardTitle, Col, ListGroup, ListGroupItem, Row } from '@sveltestrap/sveltestrap'
import { differenceInDays, eachWeekendOfInterval, isSunday } from 'date-fns'
import { colorScaleFor } from '$lib/fmt'
import { _store } from '$data/_store'
import { persisted } from 'svelte-local-storage-store'
import TimeBadge from '$cmp/TimeBadge.svelte'
import NonBillableAlert from './NonBillableAlert.svelte'
import CornerButtons from './CornerButtons.svelte'
import SummaryTable from './SummaryTable.svelte'
import Settings from '$data/Settings'
import ProgressBars from './ProgressBars.svelte'

export let billable    = 0
export let nonBillable = 0
export let start, end
export let title

function id(name) {
	return `${id.slug}-${name}`
}
id.slug = title.toLowerCase().replace(' ', '-')

/**
 * @param interval {{start:Date, end:Date}}
 * @param daysLeft
 * @return {{days:number, weekdays:number, weekends:number, saturday:number, sunday:number}}
 */
function countWeekendDaysOfInterval(interval, daysLeft = null) {
	daysLeft    = (daysLeft !== null)? daysLeft : (differenceInDays(interval.end, interval.start) + 1)
	const count = eachWeekendOfInterval(interval)
			.reduce((count, day) => {
				if (isSunday(day)) { count.days++; count.sunday++ }
				else               { count.days++; count.saturday++ }
				return count
			}, { saturday: 0, sunday: 0, days: 0 })
	count.weekdays = daysLeft - count.days
	count.weekends = count.days / 2
	return count
}

const settings         = _store.settings
const workedSecs       = billable + nonBillable
const today            = new Date()
const considerToday    = (today.getHours() < $settings.schedule.endOfDay.split(':')[0])
const daysLeft         = differenceInDays(end, today) + (considerToday ? 1 : 0)
const weekendCount     = countWeekendDaysOfInterval({ start: today, end }, daysLeft)
const fullweekendCount = countWeekendDaysOfInterval({ start, end })

let daysOff = persisted(id('daysOff'), 0)
let targetH = persisted(id('target'), 36)
$: targetSecs = $targetH * 60 * 60
$: leftSecs   = targetSecs - workedSecs

//TODO use user.settings.myStartOfDay
$: perDays = { //if any value ends up as a division-by-zero, that results in Infinity and gets hidden
	7: leftSecs / Math.max(daysLeft - $daysOff, 1),
	6: leftSecs / (daysLeft - weekendCount.sunday - $daysOff),
	5: leftSecs / (daysLeft - weekendCount.days - $daysOff),
}

$: perDaysTarget = perDays[$settings.schedule.colorize]
const workingDays = {
	7: fullweekendCount.weekdays + fullweekendCount.days,
	6: fullweekendCount.weekdays + fullweekendCount.saturday,
	5: fullweekendCount.weekdays,
}[$settings.schedule.colorize]
</script>

<Card>
	<CardHeader class={`bg-scale-${colorScaleFor(perDaysTarget)}`}>
		<Row>
			<Col>
				<CardTitle>{title}</CardTitle>
			</Col>
			<Col xs="auto" class="side-btn">
				<CornerButtons bind:daysOff bind:targetH idGen={id}/>
			</Col>
		</Row>
	</CardHeader>

	<ListGroup>
		<NonBillableAlert {nonBillable}/>

		<ListGroupItem class="pb-0">
			<SummaryTable idGen={id} {daysOff} {daysLeft} {weekendCount} {targetSecs} {leftSecs} {workedSecs}/>
		</ListGroupItem>

		<ListGroupItem class="p-0">
			<ProgressBars idGen={id} {perDaysTarget} {daysLeft} {targetH} totalDays={workingDays} {workedSecs}/>
		</ListGroupItem>

		<ListGroupItem>
			<table>
				{#each Settings.AVG_OPTIONS as { n, color, badge, period }}
					{@const doable = isFinite(perDays[n])}
					<tr class:d-none={!$settings.schedule.show.includes(n)}>
						<th class={!doable? 'text-decoration-line-through text-muted' : null}>
							<span class={doable? `text-${color}` : 'text-muted'}>{badge}</span>
							{period || 'Needed hours per day'}
						</th>
						<td>{#if doable}<TimeBadge seconds={perDays[n]}/>{/if}</td>
					</tr>
				{/each}
			</table>
		</ListGroupItem>
	</ListGroup>
</Card>
