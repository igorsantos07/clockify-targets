import { s2h } from '$lib/date.js'

const NUM_LOCALE = 'en-US'

const CURRENCY = new Intl.NumberFormat(NUM_LOCALE, { style: 'currency', currency: 'USD' })
const PERCENT  = new Intl.NumberFormat(NUM_LOCALE, { style: 'percent', maximumFractionDigits: 3 })

/**
 * @param {number} number
 * @returns {string}
 */
export const money = number => CURRENCY.format(number)

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
