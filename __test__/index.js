import { validateForm } from '../src/client/js/formValidation';

const handleSubmit = (event) => {
	event.preventDefault();

	const result = document.getElementById('result');
	const alert = document.querySelector('.alert');

	alert.classList.add('alert--hide');
	result.classList.add('result--hide');

	try {
		validateForm(
			document.getElementById('destination').value.trim(),
			document.getElementById('start_date').value.trim(),
			document.getElementById('end_date').value.trim()
		);
	} catch (err) {
		alert.classList.remove('alert--hide');
		alert.innerHTML = err;
		return;
	}

	result.classList.remove('result--hide');
};

document.getElementById('search_btn').addEventListener('click', handleSubmit);
