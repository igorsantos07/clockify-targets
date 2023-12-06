<style lang="scss">
  th {
    padding     : 0.375rem 0.5rem 0.375rem 0;
    font-weight : normal;
  }
  td > * { padding: 0 } /* wtf bootstrap, why add padding to anything inside table cells? */
</style>

<script>
	import { Alert, Button, Card, CardHeader, CardTitle, Col, FormText, Icon, Input, InputGroup, InputGroupText, ListGroup, ListGroupItem, Popover, Progress, Row, Table, Tooltip } from 'sveltestrap'
	import { differenceInDays, eachDayOfInterval, format } from 'date-fns'
	import { colorScaleFor, s2$ } from '$lib/fmt'
	import { s2d, s2h } from '$lib/date'
	import { _store } from '$data/_store'
	import { persisted } from 'svelte-local-storage-store'
	import TimeBadge from '$cmp/TimeBadge.svelte'
	import plur from 'plur'

	export let billable    = 0
	export let nonBillable = 0
	export let end
	export let title

	const settings = _store.settings
	$: showOff = !$settings.hideMoney

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
	$: targetS = $targetH * 60 * 60
	$: leftS = targetS - workedHours

	//TODO use user.settings.myStartOfDay
	$: perDay = leftS / Math.max(daysLeft - $daysOff, 1)
	$: perDayWoSunday = leftS / Math.max(daysLeft - weekendCount.sunday - $daysOff, 1)
	$: perDayWoWeekend = leftS / Math.max(daysLeft - weekendCount.days - $daysOff, 1)
</script>

<Card class="mb-3">
	<CardHeader class={`bg-scale-${colorScaleFor(perDayWoSunday)}`}>
		<Row>
			<Col>
				<CardTitle>{title}</CardTitle>
			</Col>
			<Col xs="auto" class="side-btn">
				<Button color="transparent" id={id('days-off')}>🏖 {$daysOff || '∅'}</Button>
				<Popover target={id('days-off')} placement="right" title="🏖 Holidays / vacations?">
					<InputGroup>
						<Input class="w-auto" bind:value={$daysOff} type="number" min="0" max="31" />
						<InputGroupText>days off</InputGroupText>
					</InputGroup>
					<FormText>Must be reduced once each day off gets spent.</FormText>
				</Popover>

				<Button color="transparent" id={id('target')}>🎯 {$targetH}h</Button>
				<Popover target={id('target')} placement="right" title="🎯 Your target">
					<InputGroup>
						<Input class="w-auto" bind:value={$targetH} type="number" min="0" max="200"/>
						<InputGroupText>hours</InputGroupText>
					</InputGroup>
				</Popover>
			</Col>
		</Row>
	</CardHeader>

	<ListGroup>
		{#if nonBillable}
			<ListGroupItem class="p-0 border-0">
				<Alert color="danger" class="mb-0 border-0">
					You got {s2d(nonBillable)} ({s2$(nonBillable)}) of <b>non-billable time</b>!
				</Alert>
			</ListGroupItem>
		{/if}

		<ListGroupItem class="pb-0">
			<Table style="width:auto" class="mb-0">
				<tr>
					<td colspan="2">
						<big>
							<u><b><tt>{s2d(workedHours)}</tt></b> so far</u>
							{#if showOff}({s2$(workedHours)} out of {s2$(targetS)}){/if}
						</big>
					</td>
				</tr>
				<tr>
					<th>Hours left:</th>
					<td><tt>{s2d(leftS)}</tt> {#if showOff}({s2$(leftS)}!!!){/if}</td>
				</tr>
				<tr>
					<th>Days left:</th>
					<td>
						<span id={id('days-desc')} class="hover-help">{daysLeft} {plur('day', daysLeft)}</span>
						<small class="text-muted">
							(with {weekendCount.weekends? weekendCount.weekends : 'no'} {plur('weekend', weekendCount.weekends)}{#if $daysOff}&nbsp;+ {$daysOff} {plur('day', $daysOff)} off{/if})
						</small>

						<Tooltip target={id('days-desc')}>
							<ul class="mb-0 text-start ps-3">
								<li><b>{weekendCount.weekdays}</b> {plur('weekday', weekendCount.weekdays)}</li>
								<li><b>{weekendCount.saturday}</b> {plur('Saturday', weekendCount.saturday)}</li>
								<li><b>{weekendCount.sunday}</b> {plur('Sunday', weekendCount.sunday)}</li>
								<li><b>{$daysOff || 'no'}</b> {plur('day', $daysOff)} off</li>
							</ul>
						</Tooltip>
					</td>
				</tr>
			</Table>
		</ListGroupItem>

		<ListGroupItem class="p-0">
			<Progress animated class={`bg-scale-${colorScaleFor(perDayWoSunday)}`} value={s2h(workedHours)}
			          max={$targetH}>{s2h(workedHours) / $targetH > 0.15 ? colorScaleFor(perDayWoSunday, true) : '!!'}</Progress>
		</ListGroupItem>

		<ListGroupItem class="pb-0">
			<Table style="width:auto" class="mb-1">
				<tr>
					<th>Needed hours per day</th>
					<td><TimeBadge seconds={perDay} /></td>
				</tr>
				<tr>
					<th>...excluding Sundays</th>
					<td><TimeBadge seconds={perDayWoSunday} /></td>
				</tr>
				<tr>
					<th>...excluding weekends</th>
					<td><TimeBadge seconds={perDayWoWeekend} /></td>
				</tr>
			</Table>
		</ListGroupItem>
	</ListGroup>
</Card>
