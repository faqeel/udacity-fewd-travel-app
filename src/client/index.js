import './styles/style.scss';

// Dark/Light Mode Switch
const theme = document.querySelector('.theme');
theme.addEventListener('click', () => {
  theme.classList.toggle('active');
  alert('Sorry, this functionality is not implemented yet🏃‍♂️');
});

// Enable forecast element to scroll horizontally
const forecast = document.querySelector('.forecast');
forecast.addEventListener('wheel', (e) => {
  if (e.deltaY > 0) {
    forecast.scrollLeft += 50;
  } else {
    forecast.scrollLeft -= 50;
  }
});
