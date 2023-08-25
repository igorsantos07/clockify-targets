import Model from './Model'

/** @typedef ClockifySettings
 * @property {'MONDAY'|'SUNDAY'} weekStart
 * @property {string} timeZone
 * @property {'HOUR12'|'HOUR24'} timeFormat
 * @property {'LIGHT'|'DARK'} theme //TODO support light/dark themes automatically
 * @property {string} myStartOfDay Time in the format HH:MM
 */
/**
 * @property {string} id
 * @property {string} email
 * @property {string} name
 * @property {string} profilePicture full URL
 * @property {ClockifySettings} settings
 * @property {string} activeWorkspace
 */
export default class User extends Model {

	get baseURL() {
		return `workspaces/${this.activeWorkspace}/user/${this.id}/`
	}
}
