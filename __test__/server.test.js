const request = require('supertest');
const server = require('../src/server/server');

describe('GET /search', () => {
	test('responds with json', (done) => {
		request(server)
			.post('/search')
			.send({ destination: 'London', startDate: '2020-08-22', endDate: '2020-08-25' })
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(200)
			.end((err, res) => {
				if (err) return done(err);
				done();
			});
	});
});
