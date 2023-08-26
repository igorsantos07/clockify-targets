import { end } from 'iso8601-duration'

export default class TimeSummary {
	/** @type number */ billable = 0
	/** @type number */ nonBillable = 0
	/** @type Date */ end

	constructor(end) {
		this.end = end
	}
}
