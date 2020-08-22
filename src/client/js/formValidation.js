const isValidDate = (date) => date instanceof Date && !isNaN(date);

const validateForm = (destination, startDate, endDate) => {
	const city = new RegExp(/^[a-zA-Z\u0080-\u024F]+(?:([\ \-\']|(\.\ ))[a-zA-Z\u0080-\u024F]+)*$/);
	const start = new Date(startDate);
	const end = new Date(endDate);
	if (!city.test(destination)) {
		throw 'Please enter valid destination 👀';
	} else if (!(isValidDate(start) && isValidDate(end))) {
		throw 'Please enter valid date 📅';
	} else if (start > end) {
		throw 'The start date must be less than the end date 🤔';
	}
	return true;
};

export { validateForm };
