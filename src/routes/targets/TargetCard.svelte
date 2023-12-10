<script>
import { Card, CardHeader, CardTitle, Col, ListGroup, ListGroupItem, Row } from 'sveltestrap'
import { differenceInDays, eachDayOfInterval, format } from 'date-fns'
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
id.slug = title.replace(' ', '-')

const workedSecs    = billable + nonBillable
const today         = new Date()
const considerToday = (today.getHours() < 18) //TODO make this a setting
const totalDays     = (differenceInDays(end, start) + 1)
const daysLeft      = differenceInDays(end, today) + (considerToday ? 1 : 0)
const weekendCount  = eachDayOfInterval({ start: today, end })
	.map(date => format(date, 'i')) //6 = Saturday, 7 = Sunday
	.reduce((count, dow) => {
		if (dow == 6) { count.days++; count.saturday++ }
		if (dow == 7) { count.days++; count.sunday++ }
		return count
	}, { saturday: 0, sunday: 0, days: 0 })
weekendCount.weekdays = daysLeft - weekendCount.days
weekendCount.weekends = weekendCount.days / 2

let daysOff = persisted(id('daysOff'), 0)
let targetH = persisted(id('target'), 36)
$: targetSecs = $targetH * 60 * 60
$: leftSecs   = targetSecs - workedSecs

const settings = _store.settings

//TODO use user.settings.myStartOfDay
$: perDays = {
	7: leftSecs / Math.max(daysLeft - $daysOff, 1),
	6: leftSecs / Math.max(daysLeft - weekendCount.sunday - $daysOff, 1),
	5: leftSecs / Math.max(daysLeft - weekendCount.days - $daysOff, 1),
}
$: perDaysTarget = perDays[$settings.schedule.colorize]
</script>

<Card class="mb-3">
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
			<ProgressBars idGen={id} {perDaysTarget} {daysLeft} {targetH} {totalDays} {workedSecs}/>
		</ListGroupItem>

		<ListGroupItem>
			<table>
				{#each Settings.AVG_OPTIONS as { n, color, badge, period }}
					<tr class:d-none={!$settings.schedule.show.includes(n)}>
						<th><span class={`text-${color}`}>{badge}</span> {period || 'Needed hours per day'}</th>
						<td><TimeBadge seconds={perDays[n]}/></td>
					</tr>
				{/each}
			</table>
		</ListGroupItem>
	</ListGroup>
</Card>
