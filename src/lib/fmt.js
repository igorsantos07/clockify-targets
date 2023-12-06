import { s2h } from '$lib/date'
import { _store } from '../data/_store'

const CURRENCY_LOCALES = {
	'BRL': 'pt-BR',
	'USD': 'en-US',
	'GBP': 'en-GB',
	'EUR': 'es-ES' //FIXME
}

let MFD2, CURRENCY, CURRENCY_LG, PERCENT, NUM_LOCALE, HOURLY_RATE, EXCHANGE_RATE
_store.settings.subscribe(({ hourlyRate, currency, exchange }) => {
	NUM_LOCALE  = CURRENCY_LOCALES[currency] || 'en-US'
	MFD2        = new Intl.NumberFormat('en-US', { style: 'decimal', minimumFractionDigits: 2 }) //forced to EN, so it fits input[type=number]
	CURRENCY    = new Intl.NumberFormat(NUM_LOCALE, { style: 'currency', currency })
	CURRENCY_LG = new Intl.NumberFormat(NUM_LOCALE, { style: 'currency', currency, minimumFractionDigits: 4 })
	PERCENT     = new Intl.NumberFormat(NUM_LOCALE, { style: 'percent', maximumFractionDigits: 3 })
	//TODO create a percent()

	HOURLY_RATE   = hourlyRate
	EXCHANGE_RATE = currency == 'USD'? 1 : (exchange.rate * (1 - (exchange.fee / 100)))
})

/**
 * Formats the number with "Minimum Fraction Digits = 2"
 * @param {number|string} number
 * @returns {string}
 */
export const mfd2 = number => MFD2.format(number)

/**
 * Formats the number in the selected currency (from {@link Settings} and its related locale, as per {@link CURRENCY_LOCALES}
 * @see moneyLong()
 * @param {number|string} number
 * @returns {string}
 */
export const money = number => CURRENCY.format(number)

/**
 * Formats the number in the selected currency (from {@link Settings} with 4 fraction digits.
 * @see money()
 * @param {number|string} number
 * @returns {string}
 */
export const moneyLong = number => CURRENCY_LG.format(number)

export function s2$(seconds) {
	const ratePerSecond = HOURLY_RATE / 60 / 60 * EXCHANGE_RATE
	return money(seconds * ratePerSecond)
}

export function colorScaleFor(seconds, asText = false) {
	const hours = s2h(seconds)
	if (hours < 7) {
		return asText? 'awesome!' : 'n1';
	}
	if (hours < 8) {
		return asText? 'good' : 0;
	}
	if (hours < 9) {
		return asText? 'doable' : 1;
	}
	if (hours < 10) {
		return asText? 'bad' : 2;
	}
	if (hours < 11) {
		return asText? 'VERY bad' : 3;
	}
	if (hours < 12) {
		return asText? 'terrible!!' : 4;
	}
	return asText? 'seriously?!' : 5;
}
