import './styles/style.scss';

// Dark/Light Mode Switch
document.querySelector('.theme-switch').addEventListener('click', () => {
	document.querySelector('.theme-switch__icon').classList.toggle('theme-switch__icon--active');
	alert('Sorry, this functionality is not implemented yet🏃‍♂️');
});

// Enable forecast element to scroll horizontally
const forecast = document.querySelector('.result__forecast');
forecast.addEventListener('wheel', (e) => {
	if (e.deltaY > 0) {
		forecast.scrollLeft += 50;
	} else {
		forecast.scrollLeft -= 50;
	}
});
