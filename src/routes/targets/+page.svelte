<script>
	import TargetCard from './TargetCard.svelte'
	import Title from '$cmp/Title.svelte'

	/** @type {{weekly:TimeSummary, fortnightly:TimeSummary, monthly:TimeSummary}} */
	export let data
</script>

<Title page="Time targets"/>
<TargetCard title="This week" {...data.weekly}/>
<TargetCard title="This fortnight" {...data.fortnightly}/>
<TargetCard title="This month" {...data.monthly}/>
