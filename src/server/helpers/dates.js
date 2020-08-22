module.exports = {
	diffBetweenDates: (startDate, endDate) => {
		const diffTime = Math.abs(startDate - endDate);
		return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
	},

	formatDate: (date, format) => {
		date = date.toDateString().split(' ');
		date = {
			name: date[0],
			mounth: date[1],
			day: date[2],
			year: date[3],
		};
		return format
			.toUpperCase()
			.split(' ')
			.map((char) => {
				if (char.includes('N')) {
					return char.replace('N', date.name);
				} else if (char.includes('M')) {
					return char.replace('M', date.mounth);
				} else if (char.includes('D')) {
					return char.replace('D', date.day);
				} else if (char.includes('Y')) {
					return char.replace('Y', date.year);
				}
			})
			.join(' ');
	},
};
