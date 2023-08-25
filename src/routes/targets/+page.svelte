<script>
	import { s2d, s2h } from '$lib/date'
	import { money, colorScaleFor } from '$lib/fmt'
	import { Alert, Card, CardBody, CardFooter, CardHeader, Col, Input, InputGroup, InputGroupText, ListGroup, ListGroupItem, Progress, Row } from 'sveltestrap'
	import { persisted } from 'svelte-local-storage-store'
	import { format } from 'date-fns'
	import TimeBadge from '$cmp/TimeBadge.svelte'

	function s2$(seconds) {
		//FIXME #5
		const rate = 48
		const ratePerSecond = rate / 60 / 60
		return money(seconds * ratePerSecond)
	}

	/** @type {{billable:number, nonBillable:number}} */
	export let data

	const workedSum = data.billable + data.nonBillable
	let targetH = persisted('target', 36)
	$: targetS = $targetH * 60 * 60
	$: leftS = targetS - workedSum

	//TODO use user.settings.myStartOfDay
	$: daysLeft = 7 - format(Date.now(), 'i') + 1 //including today
	$: leftPerDay = leftS / daysLeft
	$: leftPerDayWithOff = leftS / (daysLeft - 1)
	$: leftPerDayWithOffs = leftS / (daysLeft - 2)
</script>

{#if data.nonBillable}
	<Alert color="danger" class="mt-n3">
		You got {s2d(data.nonBillable)} ({s2$(data.nonBillable)}) of <b>non-billable time</b>!
	</Alert>
{/if}

<Card>
	<CardHeader class={`bg-scale-${colorScaleFor(leftPerDayWithOff)}`}>Currently worked hours</CardHeader>
	<CardBody>
		<Row>
			<Col>{s2d(data.billable)} so far</Col>
			<Col>{s2$(data.billable)}</Col>
		</Row>
	</CardBody>
	<CardFooter class="p-0">
		<Progress animated class={`bg-scale-${colorScaleFor(leftPerDayWithOff)}`} value={s2h(workedSum)} max={$targetH}>{s2h(workedSum) / $targetH > 0.15? colorScaleFor(leftPerDayWithOff, true) : '!!'}</Progress>
	</CardFooter>
</Card>
<Card class="mt-4">
	<CardHeader>Your weekly target</CardHeader>
	<ListGroup>
		<ListGroupItem>
			<InputGroup>
				<Input bind:value={$targetH} type="number" min="0" max="60"/>
				<InputGroupText>hours</InputGroupText>
			</InputGroup>
		</ListGroupItem>
		<ListGroupItem>
			Hours left: <tt>{s2d(leftS)}</tt> ({s2$(leftS)}!!!)
		</ListGroupItem>
		<ListGroupItem>
			Expected hours per day until EoW: <TimeBadge {daysLeft} seconds={leftPerDay}/>
		</ListGroupItem>
		<ListGroupItem>
			...with one day off: <TimeBadge {daysLeft} seconds={leftPerDayWithOff}/>
		</ListGroupItem>
		<ListGroupItem>
			...with an actual weekend: <TimeBadge {daysLeft} seconds={leftPerDayWithOffs}/>
		</ListGroupItem>
	</ListGroup>
</Card>
