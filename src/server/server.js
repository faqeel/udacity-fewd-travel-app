require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

app.use(express.static('dist'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(morgan('tiny'));
app.use(cors());

app.get('/test', (req, res) => {
  res.send('Test Page');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
