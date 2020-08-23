import { handleSubmit } from '../src/client/js/app';

describe('Testing the existence of handleSubmit()', () => {
	test('handleSubmit() is defined', () => {
		expect(handleSubmit).toBeDefined();
	});
});

describe('Testing the ability of handleSubmit() to handle form submit', () => {
	document.body.innerHTML = `
			<form class="form">
				<input type="text" name="destination" id="destination" placeholder="Enter your destination" />
				<input type="date" name="start_date" id="start_date" />
				<input type="date" name="end_date" id="end_date" />
				<button class="btn form__submit" id="search_btn">Search</button>
			</form>

			<div class="alert alert--hide"></div>
			
			<section id="result" class="result result--hide"></section>
		`;

	const destination = document.getElementById('destination');
	const startDate = document.getElementById('start_date');
	const endDate = document.getElementById('end_date');
	const searchButton = document.getElementById('search_btn');
	const alert = document.querySelector('.alert');
	const result = document.getElementById('result');

	require('./index');

	afterEach(() => {
		alert.innerHTML = '';
		result.innerHTML = '';
	});

	test('Check for an empty destination to be invalid', () => {
		destination.value = '';
		startDate.value = '2020-08-22';
		endDate.value = '2020-08-23';

		searchButton.click();

		expect(alert.innerHTML).toBe('Please enter valid destination 👀');
	});

	test('Check for "Paris 487" to be invalid destination', () => {
		destination.value = 'Paris 487';

		searchButton.click();

		expect(alert.innerHTML).toBe('Please enter valid destination 👀');
	});

	test('Check for "null" to be invalid destination', () => {
		destination.value = null;

		searchButton.click();

		expect(alert.innerHTML).toBe('Please enter valid destination 👀');
	});

	test('Check for "London" to be valid destination', () => {
		destination.value = 'London';

		searchButton.click();

		expect(result.classList.contains('result--hide')).toBe(false);
	});

	test('Check for "Al Khobar" to be valid destination', () => {
		destination.value = 'Al Khobar';

		searchButton.click();

		expect(result.classList.contains('result--hide')).toBe(false);
	});

	test('Check for dates start in 2020-08-22 and end in 2020-08-21 to be invalid dates', () => {
		startDate.value = '2020-08-22';
		endDate.value = '2020-08-21';

		searchButton.click();

		expect(alert.innerHTML).toBe('The start date must be less than the end date 🤔');
	});

	test('Check for dates start in 2020-08-22 and an empty end date to be invalid dates', () => {
		startDate.value = '2020-08-22';
		endDate.value = '';

		searchButton.click();

		expect(alert.innerHTML).toBe('Please enter valid date 📅');
	});
});
