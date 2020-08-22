class Trip {
	constructor(data, id = null, element = null) {
		this.data = data;
		this.id = id;
		this.name = `${data.city}, ${data.country}`;
		if (id !== null && typeof element === 'function') {
			this.element = element(this.id, this.name, true);
		} else {
			this.element = element;
		}
	}
}

export { Trip };
