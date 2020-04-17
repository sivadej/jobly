// integration tests for job routes

const request = require('supertest');
const app = require('../../app');
const db = require('../../db');

beforeEach(async () => {
	try {
		await db.query(`
			INSERT INTO companies (handle, name, num_employees, description, logo_url)
				VALUES ('beforeeach','before co','100','beforeeach co first entry','test.jpg')`);
		await db.query(`
			INSERT INTO jobs (title, salary, equity, company_handle) VALUES ($1,$2,$3,$4)`,
			['tester', 99000, 0.5, 'beforeeach']);
	}
	catch (err) {
		console.error(err);
	}
})

afterEach(async () => {
	try {
		await db.query(`DELETE FROM jobs`);
		await db.query(`DELETE FROM companies`);
	}
	catch (err) {
		console.error(err);
	}
})

describe('POST /jobs', () => {

	test('create new job', async () => {
		const response = await request(app)
			.post('/jobs')
			.send({
				"title": "Testing Tester",
				"salary": 99999,
				"equity": 0.001,
				"company_handle": "beforeeach"
			});
		expect(response.statusCode).toBe(201);
		expect(response.body.job).toHaveProperty('id');
		expect(response.body.date_posted).not.toBeNull();
	})

})

describe('GET /jobs', () => {

	test('gets list of 1 job', async () => {
		const response = await request(app).get('/jobs');
		expect(response.body.jobs).toHaveLength(1);
		expect(response.body.jobs[0]).toHaveProperty('title', 'tester');
	})

	//test search with queries

})

describe('GET /jobs/:id', () => {

	test('gets a single job description', async () => {
		const dbID = await db.query(`SELECT id FROM jobs WHERE title='tester'`);
		const id = dbID.rows[0].id;
		const response = await request(app).get(`/jobs/${id}`);
		expect(response.body).toHaveProperty('job');
		expect(response.body.job).toHaveProperty('title', 'tester');
	})

	test('returns 404 error if company not found', async () => {
		const response = await request(app).get(`/jobs/0`);
		expect(response.statusCode).toBe(404);
	})

})

describe('PATCH /jobs/:id', () => {

	test('edits a job with full body', async () => {
		const dbID = await db.query(`SELECT id FROM jobs WHERE title='tester'`);
		const id = dbID.rows[0].id;
		const response = await request(app)
			.patch(`/jobs/${id}`)
			.send({
				title: 'changed',
				salary: 1,
			});
		expect(response.statusCode).toBe(200);
		expect(response.body.job.id).toBe(id);
		expect(response.body.job.title).toBe('changed');
		expect(response.body.job.salary).toBe(1);
	})
})

describe('DELETE /jobs/:id', ()=> {

	test('deletes job by id', async ()=> {
		const dbID = await db.query(`SELECT id FROM jobs WHERE title='tester'`);
		const id = dbID.rows[0].id;
		const response = await request(app).delete(`/jobs/${id}`);
		expect(response.statusCode).toBe(200);
		expect(response.body.message).toBe('Job deleted');
	})

	test('returns 404 error if job id not found', async ()=> {
		const response = await request(app)
		.delete('/jobs/0');
		expect(response.statusCode).toBe(404);
	})

})

afterAll(async () => {
	await db.end();
})