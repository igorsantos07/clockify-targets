import { _store } from '$data/_store.js'

export default class Page {

	title = ''
	id

	set(title, id = null) {
		this.title = title
		this.id    = id || this.title.toLowerCase().replaceAll(' ', '_') || 'default' //TODO use a proper snake_case function
	}

	static init(title, id = null) {
		_store.page.update(page => {
			page.set(title, id)
			return page
		})
	}
}
