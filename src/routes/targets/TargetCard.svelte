<script>
	import { Button, Card, CardBody, CardFooter, CardHeader, CardTitle, Col, Icon, Input, InputGroup, InputGroupText, ListGroup, ListGroupItem, Popover, Progress, Row } from 'sveltestrap'
	import { format } from 'date-fns'
	import { colorScaleFor, s2$ } from '$lib/fmt'
	import { s2d, s2h } from '$lib/date'
	import { persisted } from 'svelte-local-storage-store'
	import TimeBadge from '$cmp/TimeBadge.svelte'

	export let workedHours = null
	let targetH = persisted('target', 36)
	$: targetS = $targetH * 60 * 60
	$: leftS = targetS - workedHours

	//TODO use user.settings.myStartOfDay
	$: daysLeft = 7 - format(Date.now(), 'i') + 1 //including today
	$: leftPerDay = leftS / daysLeft
	$: leftPerDayWithOff = leftS / (daysLeft - 1)
	$: leftPerDayWithOffs = leftS / (daysLeft - 2)
</script>

<Card>
	<CardHeader class={`bg-scale-${colorScaleFor(leftPerDayWithOff)}`}>
		<Row>
			<Col><CardTitle>Currently worked hours</CardTitle></Col>
			<Col xs="auto" class="side-btn">
				<!-- the button might need to be be <a tabindex> for the dismiss-from-the-outside to work properly? -->
				<Button color="transparent" id="target-config"><Icon name="bullseye"/></Button>
				<Popover target="target-config" placement="right" title="Your target" dismissible>
					<InputGroup>
						<Input bind:value={$targetH} type="number" min="0" max="60"/>
						<InputGroupText>hours</InputGroupText>
					</InputGroup>
				</Popover>
			</Col>
		</Row>
	</CardHeader>
	<CardBody>
		<Row>
			<Col>{s2d(workedHours)} so far</Col>
			<Col>{s2$(workedHours)}</Col>
		</Row>
	</CardBody>
	<CardFooter class="p-0">
		<Progress animated class={`bg-scale-${colorScaleFor(leftPerDayWithOff)}`} value={s2h(workedHours)} max={$targetH}>{s2h(workedHours) / $targetH > 0.15? colorScaleFor(leftPerDayWithOff, true) : '!!'}</Progress>
	</CardFooter>
</Card>
<Card>
	<CardHeader>Your weekly target</CardHeader>
	<ListGroup>
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
