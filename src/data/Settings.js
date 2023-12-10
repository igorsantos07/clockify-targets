import Model from './Model'

export default class Settings extends Model {

	hideMoney  = true
	currency   = 'USD'
	hourlyRate = 1
	exchange   = {
		rate: 1,
		fee : 0,
	}
	schedule = {
		colorize: '5', //should work as a number, but I guess this is a Svelte bug?
		show    : { //can't bind:group because sveltestrap is abandoned https://github.com/bestguy/sveltestrap/issues/66#issuecomment-1848219072
			7: false,
			6: false,
			5: true
		},
		maxDailyHours: 12
	}
}
