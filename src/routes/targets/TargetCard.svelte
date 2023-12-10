<style lang="scss">
  th {
    padding     : 0.375rem 0.5rem 0.375rem 0;
    font-weight : normal;
    width       : 1px;
    white-space : nowrap;
  }
  td > * { padding: 0 } /* wtf bootstrap, why add padding to anything inside table cells? */
</style>

<script>
import { Card, CardHeader, CardTitle, Col, ListGroup, ListGroupItem, Progress, Row } from 'sveltestrap'
import { differenceInDays, eachDayOfInterval, format } from 'date-fns'
import { colorScaleFor } from '$lib/fmt'
import { s2h } from '$lib/date'
import { _store } from '$data/_store'
import { persisted } from 'svelte-local-storage-store'
import TimeBadge from '$cmp/TimeBadge.svelte'
import NonBillableAlert from './NonBillableAlert.svelte'
import CornerButtons from './CornerButtons.svelte'
import SummaryTable from './SummaryTable.svelte'

export let billable    = 0
export let nonBillable = 0
export let end
export let title

const SMALL_PROGRESS_BAR = 0.15

function id(name) {
	return `${id.slug}-${name}`
}
id.slug = title.replace(' ', '-')

const workedHours   = billable + nonBillable
const today         = new Date()
const considerToday = (today.getHours() < 18) //TODO make this a setting
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
$: leftSecs = targetSecs - workedHours

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
			<SummaryTable idGen={id} {daysOff} {daysLeft} {weekendCount} {targetSecs} {leftSecs} {workedHours}/>
		</ListGroupItem>

		<ListGroupItem class="p-0">
			<Progress animated class={`bg-scale-${colorScaleFor(perDaysTarget)}`} value={s2h(workedHours)} max={$targetH}>
				{s2h(workedHours) / $targetH > SMALL_PROGRESS_BAR? colorScaleFor(perDaysTarget, true) : '!!'}
			</Progress>
		</ListGroupItem>

		<ListGroupItem>
			<table>
				{#each [[7,'➐'],[6,'➏'],[5,'➎']] as [numDays, numBadge]}
					<tr class:d-none={!$settings.schedule.show[numDays]}>
						<th>{numBadge} Needed hours per day</th>
						<td><TimeBadge seconds={perDays[numDays]}/></td>
					</tr>
				{/each}
			</table>
		</ListGroupItem>
	</ListGroup>
</Card>
