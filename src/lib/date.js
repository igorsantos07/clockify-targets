import { endOfWeek, startOfWeek } from 'date-fns'
import { _store, get } from '$data/_store'
import { parse as parseDuration, toSeconds } from 'iso8601-duration'

const WEEK_START_CLOCKIFY = {
	SUNDAY   : 0,
	MONDAY   : 1,
	TUESDAY  : 2,
	WEDNESDAY: 3,
	THURSDAY : 4,
	FRIDAY   : 5,
	SATURDAY : 6,
}

const weekStartsOn = WEEK_START_CLOCKIFY[get(_store.user)?.settings.weekStart]

const leftPad = new Intl.NumberFormat('en-US', { minimumIntegerDigits: 2 })

export const week = {
	start: (date = new Date()) => startOfWeek(date, { weekStartsOn }),
	end  : (date = new Date()) => endOfWeek(date, { weekStartsOn })
}

/**
 * Converts ISO duration strings to elapsed seconds
 * Nope, date-fns doesn't support this for AGES, nor will it in v2: https://github.com/date-fns/date-fns/pull/3151#issuecomment-1246199824.
 * @param isoDuration {string}
 * @returns {number}
 */
export const id2s = isoDuration => toSeconds(parseDuration(isoDuration))

/**
 * Converts object durations to elapsed seconds
 * Nope, date-fns doesn't support this for AGES, nor will it in v2: https://github.com/date-fns/date-fns/pull/3151#issuecomment-1246199824.
 * @param duration {object}
 * @returns {number}
 */
export const d2s = duration => toSeconds(duration)

/**
 * Seconds to duration
 * @param seconds {number}
 * @param withSeconds {boolean}
 * @returns {string} H:MM:SS
 */
export function s2d(seconds, withSeconds = false) {
	let neg = false
	if (seconds < 0) { //we will add the negative back in the end; it's easier than changing the rounding method, Math.abs, etc
		neg = true
		seconds *= -1
	}

	let s   = Math.floor(seconds % 60)
	let m   = Math.floor(seconds / 60)
	const h = Math.floor(m / 60)
	m = Math.floor(m % 60)

	const strM = leftPad.format(m)
	return (neg? '-' : '')
			+(withSeconds? `${h}:${strM}:${(leftPad.format(s))}` : `${h}:${strM}`)
}

/**
 * Seconds to hours
 * @param seconds {number}
 * @param decimalPlaces {number}
 * @returns {string}
 */
export const s2h = (seconds, decimalPlaces = 1) => (seconds / 60 / 60).toFixed(decimalPlaces)

/**
 * Hours to seconds
 * @param hours {number}
 * @returns {number}
 */
export const h2s = hours => hours * 60 * 60
