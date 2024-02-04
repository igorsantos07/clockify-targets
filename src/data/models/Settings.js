import Model from './Model.js'

export default class Settings extends Model {

	static _TYPE = 'Settings'

	static AVG_OPTIONS = [
		{ n: 7, badge: '➐', color: 'danger',  restLabel: 'days a week', label: false },
		{ n: 6, badge: '➏', color: 'warning', restLabel: 'days, Monday to Saturday', label: 'Monday to Saturday' },
		{ n: 5, badge: '➎', color: 'info',    restLabel: 'days, Monday to Friday', label: 'Monday to Friday' },
	]

	static CURRENCIES = {
		USD: '🇺🇸 USD',
		BRL: '🇧🇷 BRL',
		EUR: '🇪🇺 EUR',
		GBP: '🇬🇧 GBP',
	}

	hideMoney = true
	currency
	hourlyRate = 10
	exchange   = { //this is usually replaced at the constructor if the guessed currency is not USD
		rate: 1,
		fee : 0,
	}
	schedule = {
		colorize     : '5', //should work as a number, but I guess this is another Svelte bug?
		show         : [5, 6],
		maxDailyHours: 12,
		endOfDay     : '16:00',
	}

	constructor() {
		super()

		//guess some settings in behalf of the user, for new setups
		if (!this.currency) {
			this.currency = Settings.#guessCurrency()

			switch (this.currency) { //let's date ourselves lol
				case 'BRL':
					this.exchange.rate = 4.8
					this.exchange.fee  = 0.6
					break
				case 'EUR':
					this.exchange.rate = 0.9
					break
				case 'GBP':
					this.exchange.rate = 0.75
					break
			}
		}
	}

	/**
	 * Dirty but smart way to guess the user's country, simplified to the ones we "support" right now.
	 * Another idea is to try using the `geoip-country` package, which uses a weekly-updated offline DB, getting the user's IP from Cloudlare, AWS, ipinfo.io, api.ipify.org?format=json, etc (although this could get messed up by VPNs) (https://ipdata.co/blog/how-to-get-the-ip-address-in-javascript/).
	 * @see https://www.techighness.com/post/get-user-country-and-region-on-browser-with-javascript-only/
	 */
	static #guessCurrency() {
		const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
		const regions = tz.match(/^(?<continent>.+)(\/.+)?\/(?<city>.+)$/).groups
		switch (regions.continent) {
			case 'America':
				switch (regions.city) {
					case 'Sao_Paulo': return 'BRL'
				}
				break
			case 'Europe':
				switch (regions.city) {
					case 'Sofia': //Bulgaria
					case 'Zagreb': //Croatia (non-canonical TZ)
					case 'Prague': //Czech Republic
					case 'Copenhagen': //Denmark (non-canonical TZ)
					case 'Budapest': //Hungary
					case 'Warsaw': //Poland
					case 'Bucharest': //Romania
					case 'Stockholm': //Sweden (non-canonical TZ)
						break //does nothing, so it will return USD by default for now for all non-euro countries
					case 'London':  return 'GBP'
					default:        return 'EUR'
				}
		}
		return 'USD'
	}
	
	get shouldConsiderToday() {
		return (new Date().getHours() < this.schedule.endOfDay.split(':')[0])
	}
}
