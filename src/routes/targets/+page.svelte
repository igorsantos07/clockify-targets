<svelte:head>
	<title>Your time targets</title>
</svelte:head>
<script>
	import TargetCard from './TargetCard.svelte'

	/** @type {{weekly:TimeSummary, fortnightly:TimeSummary, monthly:TimeSummary}} */
	export let data
</script>

<TargetCard title="This week" {...data.weekly}/>
<TargetCard title="This fortnight" {...data.fortnightly}/>
<TargetCard title="This month" {...data.monthly}/>
