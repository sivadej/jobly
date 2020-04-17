// integration tests for user routes

const request = require('supertest');
const app = require('../../app');
const db = require('../../db');

beforeEach(async () => {
	try {
		await db.query(`
			INSERT INTO users (username, password, first_name, last_name, email, photo_url)
				VALUES ($1,$2,$3,$4,$5,$6)
				RETURNING username, first_name, last_name, email, photo_url`,
			['testUser','password123','ftest','lname','email@test.com','http://test.com/test.jpg']);
	}
	catch (err) {
		console.error(err);
	}
})

afterEach(async () => {
	try {
		await db.query(`DELETE FROM users`);
	}
	catch (err) {
		console.error(err);
	}
})

describe('POST /users', () => {

	test('create new user, should not return password', async () => {
		const response = await request(app)
			.post('/users')
			.send({
				"username": "TempTest",
				"password": "temptest123",
				"first_name": "temp",
				"last_name": "tempuser",
				"email": "temp@test.com",
				"photo_url": "temp.jpg",
			});
		expect(response.statusCode).toBe(201);
		expect(response.body.user).toHaveProperty('username','TempTest');
		expect(response.body.user).not.toHaveProperty('password');
	})

	//test valiates json body

})

// describe('GET /jobs', () => {

// 	test('gets list of 1 job', async () => {
// 		const response = await request(app).get('/jobs');
// 		expect(response.body.jobs).toHaveLength(1);
// 		expect(response.body.jobs[0]).toHaveProperty('title', 'tester');
// 	})

// 	//test search with queries

// })

// describe('GET /jobs/:id', () => {

// 	test('gets a single job description', async () => {
// 		const dbID = await db.query(`SELECT id FROM jobs WHERE title='tester'`);
// 		const id = dbID.rows[0].id;
// 		const response = await request(app).get(`/jobs/${id}`);
// 		expect(response.body).toHaveProperty('job');
// 		expect(response.body.job).toHaveProperty('title', 'tester');
// 	})

// 	test('returns 404 error if company not found', async () => {
// 		const response = await request(app).get(`/jobs/0`);
// 		expect(response.statusCode).toBe(404);
// 	})

// })

// describe('PATCH /jobs/:id', () => {

// 	test('edits a job with full body', async () => {
// 		const dbID = await db.query(`SELECT id FROM jobs WHERE title='tester'`);
// 		const id = dbID.rows[0].id;
// 		const response = await request(app)
// 			.patch(`/jobs/${id}`)
// 			.send({
// 				title: 'changed',
// 				salary: 1,
// 			});
// 		expect(response.statusCode).toBe(200);
// 		expect(response.body.job.id).toBe(id);
// 		expect(response.body.job.title).toBe('changed');
// 		expect(response.body.job.salary).toBe(1);
// 	})

// 	//test valiates json body

// 	//test returns 404 if job id not found

// })

// describe('DELETE /jobs/:id', ()=> {

// 	test('deletes job by id', async ()=> {
// 		const dbID = await db.query(`SELECT id FROM jobs WHERE title='tester'`);
// 		const id = dbID.rows[0].id;
// 		const response = await request(app).delete(`/jobs/${id}`);
// 		expect(response.statusCode).toBe(200);
// 		expect(response.body.message).toBe('Job deleted');
// 	})

// 	test('returns 404 error if job id not found', async ()=> {
// 		const response = await request(app)
// 		.delete('/jobs/0');
// 		expect(response.statusCode).toBe(404);
// 	})

// 	//test returns 404 if job id not found

// })

afterAll(async () => {
	await db.end();
})