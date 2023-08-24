<script>
import { Input, Label } from 'sveltestrap'

export let value = ''
export let label = ''
export let id = 'input-'+(Math.random() * 1_000_000)
</script>

{#if label}<Label for={id}>{label}</Label>{/if}
<Input bind:value={value} {...$$props} {id}/>
