class Results {
	constructor() {
		this.info = null;
		this.errors = [];
	}

	setError(error) {
		this.errors.push(error);
	}
}

export default Results;
