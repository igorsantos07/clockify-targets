<style lang="scss">
  th {
    padding     : 0.375rem 0.5rem 0.375rem 0;
    font-weight : normal;
  }
  td > * { padding: 0 } /* wtf bootstrap, why add padding to anything inside table cells? */
</style>

<script>
	import { Alert, Button, Card, CardHeader, CardTitle, Col, FormText, Icon, Input, InputGroup, InputGroupText, ListGroup, ListGroupItem, Popover, Progress, Row, Table } from 'sveltestrap'
	import { differenceInDays, eachDayOfInterval, format } from 'date-fns'
	import { colorScaleFor, s2$ } from '$lib/fmt'
	import { s2d, s2h } from '$lib/date'
	import { _store } from '$data/_store'
	import { persisted } from 'svelte-local-storage-store'
	import TimeBadge from '$cmp/TimeBadge.svelte'

	export let billable = null
	export let nonBillable = 0
	export let end
	export let title

	const settings = _store.settings
	$: showOff = !$settings.hideMoney

	const slug          = 'target-' + title.replace(' ', '-')
	const workedHours   = billable + nonBillable
	const today         = new Date()
	const considerToday = (today.getHours() < 18)
	const daysLeft      = differenceInDays(end, today) + (considerToday ? 1 : 0)
	const weekendCount  = eachDayOfInterval({ start: today, end })
		.map(date => format(date, 'i')) //6 = Saturday, 7 = Sunday
		.reduce((count, dow) => {
			if (dow == 6) { count.total++; count.saturday++ }
			if (dow == 7) { count.total++; count.sunday++ }
			return count
		}, { saturday: 0, sunday: 0, total: 0 })

	let daysOff = persisted(`${slug}-daysOff`, 0)
	let targetH = persisted(slug, 36)
	$: targetS = $targetH * 60 * 60
	$: leftS = targetS - workedHours

	//TODO use user.settings.myStartOfDay
	$: perDay = leftS / Math.max(daysLeft - $daysOff, 1)
	$: perDayWoSunday = leftS / Math.max(daysLeft - weekendCount.sunday - $daysOff, 1)
	$: perDayWoWeekend = leftS / Math.max(daysLeft - weekendCount.total - $daysOff, 1)
</script>

<Card class="mb-3">
	<CardHeader class={`bg-scale-${colorScaleFor(perDayWoSunday)}`}>
		<Row>
			<Col>
				<CardTitle>{title}</CardTitle>
			</Col>
			<Col xs="auto" class="side-btn">
				<Button color="transparent" id={`${slug}-days-off`}>
					<Icon name="emoji-sunglasses"/> <tt>{$daysOff}</tt> off
				</Button>
				<Popover target={`${slug}-days-off`} placement="right" title="🏖 Holidays / vacations?">
					<InputGroup>
						<Input bind:value={$daysOff} type="number" min="0" max="31" />
						<InputGroupText>days off</InputGroupText>
					</InputGroup>
					<FormText>Must be reduced once each day off gets spent.</FormText>
				</Popover>
			</Col>
			<Col xs="auto" class="side-btn">
				<Button color="transparent" id={`${slug}-target`}>
					<Icon name="bullseye"/> {$targetH}h
				</Button>
				<Popover target={`${slug}-target`} placement="right" title="🎯 Your target">
					<InputGroup>
						<Input bind:value={$targetH} type="number" min="0" max="200" />
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
						{daysLeft} days
						<small class="text-muted">
							(with {weekendCount.total > 0? weekendCount.total/2 : 'no'} weekend{weekendCount.total > 3? 's' : ''}{#if $daysOff}&nbsp;+ {$daysOff} day{$daysOff > 1? 's' : ''} off{/if})
						</small>
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
					<td><TimeBadge {daysLeft} seconds={perDay} /></td>
				</tr>
				<tr>
					<th>...excluding Sundays</th>
					<td><TimeBadge {daysLeft} seconds={perDayWoSunday} /></td>
				</tr>
				<tr>
					<th>...excluding weekends</th>
					<td><TimeBadge {daysLeft} seconds={perDayWoWeekend} /></td>
				</tr>
			</Table>
		</ListGroupItem>
	</ListGroup>
</Card>
