// integration tests for company routes

const request = require('supertest');
const app = require('../../app');
const db = require('../../db');

const TEST_COMPANY = {
	"handle": "test",
	"name": "Test Co.",
	"num_employees": 100,
	"description": "company from test data",
	"logo_url": "test.jpg"
};


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
		await db.query(`DELETE FROM companies`);
	}
	catch (err) {
		console.error(err);
	}
})

describe('POST /companies', () => {

	test('create new company', async () => {
		const response = await request(app)
			.post('/companies')
			.send(TEST_COMPANY);
		expect(response.statusCode).toBe(201);
		expect(response.body.company).toHaveProperty('handle');
	})

	test('will not create duplicate company', async () => {
		const response = await request(app)
			.post('/companies')
			.send({
				handle: 'beforeeach',
				name: 'before co',
				num_employees: 100,
				description: 'beforeeach co first entry',
				logo_url: 'test.jpg',
			});
		expect(response.statusCode).toBe(500);
	})

	//test valiates json body

})

describe('GET /companies', () => {

	test('gets list of 1 company', async () => {
		const response = await request(app).get('/companies');
		expect(response.body.companies).toHaveLength(1);
		expect(response.body.companies[0]).toHaveProperty('name', 'before co');
	})

	//test gets company own jobs

})

describe('GET /companies/:handle', () => {

	test('gets a single company', async () => {
		const response = await request(app).get('/companies/beforeeach');
		expect(response.body).toHaveProperty('company');
		expect(response.body.company).toHaveProperty('handle', 'beforeeach');
	})

	test('returns 404 error if company not found', async () => {
		const response = await request(app).get('/companies/NotARealCompany');
		expect(response.statusCode).toBe(404);
	})

})

describe('PATCH /companies/:handle', () => {

	test('edits a company with full body', async () => {
		const response = await request(app)
			.patch('/companies/beforeeach')
			.send({
				handle: 'beforeeach',
				name: 'edited name',
				num_employees: 1,
				description: 'edited desc',
				logo_url: 'edited.jpg',
			});
		expect(response.statusCode).toBe(200);
		expect(response.body.company.name).toBe('edited name');
		expect(response.body.company.num_employees).toBe(1);
		expect(response.body.company.description).toBe('edited desc');
		expect(response.body.company.logo_url).toBe('edited.jpg');
	})

	test('partially edit a company', async () => {
		const response = await request(app)
			.patch('/companies/beforeeach')
			.send({
				name: 'partial',
				logo_url: 'partial.jpg',
			});
		expect(response.statusCode).toBe(200);
		expect(response.body).toHaveProperty('company');
		expect(response.body.company.handle).toBe('beforeeach');
		expect(response.body.company.name).toBe('partial');
		expect(response.body.company.num_employees).toBe(100);
		expect(response.body.company.logo_url).toBe('partial.jpg');
	})

	test('returns 404 error if company not found', async () => {
		const response = await request(app)
			.patch('/companies/NOTREALCOMPANY')
			.send({
				name: 'errorplease',
				logo_url: 'throwme.jpg',
			});
		expect(response.statusCode).toBe(404);
	})

	//test valiates json body

})

describe('DELETE /companies/:handle', () => {

	test('deletes company by handle parameter', async () => {
		const response = await request(app)
			.delete('/companies/beforeeach');
		expect(response.statusCode).toBe(200);
		expect(response.body.message).toBe('Company deleted');
	})

	test('returns 404 error if company not found', async () => {
		const response = await request(app)
			.delete('/companies/NOTREALCOMPANY');
		expect(response.statusCode).toBe(404);
	})

})


afterAll(async () => {
	await db.end();
})