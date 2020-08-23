require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const axios = require('axios');
const { diffBetweenDates, formatDate } = require('./helpers/dates');

const app = express();

app.use(express.static('dist'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(morgan('tiny'));
app.use(cors());

// 1 - Setup the data object
app.use('/search', (req, res, next) => {
	res.locals.data = {};

	res.locals.data.startDate = formatDate(new Date(req.body.startDate), 'D M Y');
	res.locals.data.endDate = formatDate(new Date(req.body.endDate), 'D M Y');
	res.locals.data.duration = diffBetweenDates(new Date(req.body.startDate), new Date(req.body.endDate));

	return next();
});

// 2 - Fetch data form GeoNames API
app.post('/search', async (req, res, next) => {
	await axios
		.get('http://api.geonames.org/searchJSON?', {
			params: {
				q: req.body.destination,
				maxRows: 1,
				username: process.env.GOENAMES_USERNAME,
			},
		})
		.then(({ data: { geonames } }) => {
			res.locals.data.city = geonames[0].name;
			res.locals.data.country = geonames[0].countryName;
			res.locals.data.lng = geonames[0].lng;
			res.locals.data.lat = geonames[0].lat;
		})
		.catch((err) => console.log(err));

	return next();
});

// 3 - Fetch data form Weatherbit API
app.post('/search', async (req, res, next) => {
	// Current weather
	await axios
		.get('https://api.weatherbit.io/v2.0/current?', {
			params: {
				lat: res.locals.data.lat,
				lon: res.locals.data.lng,
				key: process.env.WEATHERBIT_API_KEY,
			},
		})
		.then(({ data: { data } }) => {
			res.locals.data.date = formatDate(new Date(data[0].ob_time.split(' ')[0]), 'N, D M');
			res.locals.data.feels = data[0].app_temp;
			res.locals.data.sunset = data[0].sunset;
			res.locals.data.icon = data[0].weather.icon;
			res.locals.data.description = data[0].weather.description;
			res.locals.data.temp = data[0].temp;
			res.locals.data.forecast = [];
		})
		.catch((err) => console.log(err));

	// If the date is not within a week, go to the next middleware
	if (!(diffBetweenDates(new Date(), new Date(req.body.startDate)) <= 7)) {
		return next();
	}

	// 16 day weather forecast
	await axios
		.get('https://api.weatherbit.io/v2.0/forecast/daily?', {
			params: {
				lat: res.locals.data.lat,
				lon: res.locals.data.lng,
				key: process.env.WEATHERBIT_API_KEY,
			},
		})
		.then(({ data: { data } }) => {
			data.forEach((day) => {
				res.locals.data.forecast.push({
					date: formatDate(new Date(day.valid_date), 'N, D M'),
					icon: `https://www.weatherbit.io/static/img/icons/${day.weather.icon}.png`,
					description: day.weather.description,
					temp: day.temp,
				});
			});
		})
		.catch((err) => console.log(err));

	return next();
});

// 4 - Fetch data form Pixabay API
app.post('/search', async (req, res, next) => {
	await axios
		.get('https://pixabay.com/api/?', {
			params: {
				q: res.locals.data.city,
				image_type: 'photo',
				key: process.env.PIXABAY_API_KEY,
			},
		})
		.then(({ data: { hits } }) => {
			const randomIndex = Math.floor(Math.random() * hits.length);
			res.locals.data.picture = hits[randomIndex].largeImageURL;
		})
		.catch((err) => console.log(err));

	return next();
});

// 5 - Fetch data form REST Countries API & Send the response
app.post('/search', async (req, res, next) => {
	await axios
		.get(`https://restcountries.eu/rest/v2/name/${res.locals.data.country}`)
		.then(({ data: data }) => {
			res.locals.data.region = data[0].region;
			res.locals.data.timezones = data[0].timezones;
			res.locals.data.currencies = data[0].currencies;
			res.locals.data.languages = data[0].languages;
		})
		.catch((err) => console.log(err));

	res.setHeader('Set-Cookie', 'HttpOnly;Secure;SameSite=Strict');
	res.send(res.locals.data);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
