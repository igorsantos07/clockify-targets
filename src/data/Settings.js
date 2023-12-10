import Model from './Model'

export default class Settings extends Model {

	static AVG_OPTIONS = [
		{ n: 7, badge: '➐', color: 'danger',  restLabel: 'days a week', period: false },
		{ n: 6, badge: '➏', color: 'warning', restLabel: 'days, Monday to Saturday', period: 'Monday to Saturday' },
		{ n: 5, badge: '➎', color: 'info',    restLabel: 'days, Monday to Friday', period: 'Monday to Friday' },
	]

	hideMoney  = true
	currency   = 'USD'
	hourlyRate = 1
	exchange   = {
		rate: 1,
		fee : 0,
	}
	schedule = {
		colorize     : '5', //should work as a number, but I guess this is another Svelte bug?
		show         : [],
		maxDailyHours: 12,
	}
}
