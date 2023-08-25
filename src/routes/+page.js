import { _store, get } from '$data/_store'
import API from '$lib/API'
import { d2s, week } from '$lib/date'
import { formatISO } from 'date-fns'

export async function load({ params }) {

	/** @type User */
	const user = get(_store.user)
	const { data } = await API.get(user.baseURL + 'time-entries', { //FIXME error handling
		params: {
			start: formatISO(week.start()),
			end  : formatISO(week.end()),
		},
	})

	/** @typedef TimeEntry
		 * @property {boolean} billable
		 * @property {TimeInterval} timeInterval
 */
	/** @typedef TimeInterval
	 * @property {string} start ISO
	 * @property {string} end ISO
	 * @property {string} duration ISO? e.g. PT2H35M45
	 */

	/**
	 * @param {object} totals
	 * @param {TimeEntry} entry */
	function reduce(totals, entry) { //named so it gets typed.....
		const seconds = d2s(entry.timeInterval.duration)
		totals[entry.billable ? 'billable' : 'nonBillable'] += seconds
		return totals
	}

	const seconds = data.reduce(reduce, { billable: 0, nonBillable: 0 })

	return { ...seconds }
}
