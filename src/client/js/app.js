import { validateForm } from './formValidation';
import { Trip } from './Trip';

let trips = JSON.parse(localStorage.getItem('trips')) || [];
let currentTrip;

const result = document.querySelector('#result');

const handleSubmit = (event) => {
	event.preventDefault();

	const alert = document.querySelector('.alert');
	const loading = document.querySelector('.loading');

	alert.classList.add('alert--hide');
	loading.classList.add('loading--hide');
	result.classList.add('result--hide');

	const destination = document.getElementById('destination').value.trim();
	const startDate = document.getElementById('start_date').value.trim();
	const endDate = document.getElementById('end_date').value.trim();

	try {
		validateForm(destination, startDate, endDate);
	} catch (err) {
		removeActiveItem();
		alert.classList.remove('alert--hide');
		alert.innerHTML = err;
		return;
	}

	loading.classList.remove('loading--hide');

	fetch('http://localhost:3000/search', {
		method: 'POST',
		credentials: 'same-origin',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ destination, startDate, endDate }),
	})
		.then((data) => data.json())
		.then((data) => {
			currentTrip = new Trip(data);
			updateUI(currentTrip);
		})
		.then(() => {
			loading.classList.add('loading--hide');
			result.classList.remove('result--hide');
		})
		.catch(() => {
			loading.classList.add('loading--hide');
			result.classList.add('result--hide');
			alert.classList.remove('alert--hide');
			alert.innerHTML = "Ops, Something went wrong. Let's try one more again 😬";
		});
};

const handleSaveTrip = () => {
	const savedTripsMsg = document.querySelector('.saved-trips p');
	if (savedTripsMsg) {
		savedTripsMsg.remove();
	}

	trips.push(new Trip(currentTrip.data, trips.length, createTripItem));

	updateLocalStorage();

	document.getElementById('save_trip').style.display = 'none';
};

const createTripItem = (id, name, active = false) => {
	const li = document.createElement('li');
	const a = document.createElement('a');
	const button = document.createElement('button');

	if (active) {
		li.className = 'trips-list__item trips-list__item--active';
	} else {
		li.className = 'trips-list__item';
	}
	li.setAttribute('data-id', id);
	a.setAttribute('href', '#result');
	button.className = 'btn__icon delete-btn';

	button.innerHTML = 'Delete';
	a.innerHTML = name;

	li.append(a);
	li.append(button);

	button.addEventListener('click', handleDeleteTrip);
	a.addEventListener('click', handleDisplayTrip);

	document.querySelector('.trips-list').append(li);

	return li;
};

const removeActiveItem = () => {
	document
		.querySelectorAll('.trips-list__item--active')
		.forEach((elm) => elm.classList.remove('trips-list__item--active'));
};

const displayTrip = (id) => {
	result.classList.add('result--hide');
	trips[id].element.classList.add('trips-list__item--active');
	updateUI(trips[id]);
};

const handleDisplayTrip = (event) => {
	displayTrip(event.target.parentElement.getAttribute('data-id'));
};

const handleDeleteTrip = (event) => {
	const id = parseInt(event.target.parentElement.getAttribute('data-id'));
	const elm = trips[id].element;

	// Update items ID and index
	for (let i = id; i < trips.length - 1; i++) {
		trips[i + 1].id = i;
		trips[i + 1].element.setAttribute('data-id', i);
		trips[i] = trips[i + 1];
	}

	// Remove the last item because it will be duplicate
	trips.pop();

	// Remove the targeted item from the UI
	elm.remove();

	updateLocalStorage();

	if (elm.classList.contains('trips-list__item--active')) {
		result.classList.add('result--hide');
	}

	if (!trips.length) {
		const p = document.createElement('p');
		p.innerHTML = 'There are no saved trips';
		document.querySelector('.saved-trips').append(p);
	}
};

const updateLocalStorage = () => {
	const data = [];
	trips.forEach((trip) => data.push(trip.data));
	localStorage.setItem('trips', JSON.stringify(data));
};

const updateUI = ({ id, data }) => {
	document.querySelector('.result').classList.remove('result--hide');

	const timezones = document.getElementById('dest_timezone');
	const currencies = document.getElementById('dest_currency');
	const languages = document.getElementById('dest_language');
	const forecast = document.querySelector('.result__forecast');

	const createForecastElement = (data) => {
		const article = document.createElement('article');
		const p = document.createElement('p');
		const div = document.createElement('div');
		const img = document.createElement('img');
		const span = document.createElement('span');

		article.classList.add('card');
		p.classList.add('card__text');
		p.classList.add('card__text--sm');
		div.classList.add('weather__icon');
		span.classList.add('card__text');
		span.classList.add('card__text--lg');
		span.classList.add('card__text--lg--temp');

		p.innerHTML = data.date;
		img.setAttribute('src', data.icon);
		img.setAttribute('alt', data.description);
		span.innerHTML = data.temp;

		div.append(img);

		article.append(p);
		article.append(div);
		article.append(span);

		return article;
	};

	document.getElementById('dest_picture').style.backgroundImage = `url(${data.picture})`;
	document.getElementById('dest_name').innerHTML = `${data.city}, ${data.country}`;
	document.getElementById('dest_region').innerHTML = data.region;

	timezones.innerHTML = '';
	data.timezones.forEach((timezone, index, array) => {
		if (index === array.length - 1) {
			timezones.innerHTML += timezone;
		} else {
			timezones.innerHTML += timezone + ' - ';
		}
	});

	currencies.innerHTML = '';
	data.currencies.forEach((currency, index, array) => {
		if (index === array.length - 1) {
			currencies.innerHTML += `${currency.symbol} ${currency.name}`;
		} else {
			currencies.innerHTML += `${currency.symbol} ${currency.name} - `;
		}
	});

	languages.innerHTML = '';
	data.languages.forEach((language, index, array) => {
		if (index === array.length - 1) {
			languages.innerHTML += language.name;
		} else {
			languages.innerHTML += language.name + ' - ';
		}
	});

	document.getElementById('dest_dates').innerHTML = `${data.startDate} → ${data.endDate}`;
	document.getElementById('dest_duration').innerHTML = data.duration;

	document.getElementById('cur_weather_date').innerHTML = data.date;
	document.getElementById('cur_weather_temp').innerHTML = data.temp;
	document.getElementById('cur_weather_feels').innerHTML = data.feels;
	document.getElementById('cur_weather_sunset').innerHTML = data.sunset;

	forecast.innerHTML = '';

	if (Array.isArray(data.forecast) && data.forecast.length) {
		data.forecast.forEach((day) => {
			forecast.append(createForecastElement(day));
		});
	}

	removeActiveItem();

	if (id === null) {
		document.getElementById('save_trip').style.display = 'block';
	} else {
		document.getElementById('save_trip').style.display = 'none';
		trips[id].element.classList.add('trips-list__item--active');
	}
};

(() => {
	if (!trips.length) {
		return;
	}
	const savedTripsMsg = document.querySelector('.saved-trips p');
	if (savedTripsMsg) {
		savedTripsMsg.remove();
	}
	trips = trips.map((trip, index) => new Trip(trip, index, createTripItem));
	displayTrip(trips[0].id);
})();

export { handleSubmit, handleSaveTrip };
