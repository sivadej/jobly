//unit test for partialUpdate.js helper
const sqlForPartialUpdate = require('../../helpers/partialUpdate');

describe("sqlForPartialUpdate()", () => {

	it("should generate a proper partial update query with just 1 field", ()=> {
		let testQuery = sqlForPartialUpdate('customers', { name: 'test' }, 'cust_id', 2);
		expect(testQuery.query).toEqual('UPDATE customers SET name=$1 WHERE cust_id=$2 RETURNING *');
		expect(testQuery.values).toEqual(['test', 2]);
	});

	it("should ignore properties beginning with _", ()=> {
		let testQuery = sqlForPartialUpdate('users', { my_name: 'test2', _deleteme: 'please', _ignore:'this' }, 'cust_id', 99);
		expect(testQuery.query).toEqual('UPDATE users SET my_name=$1 WHERE cust_id=$2 RETURNING *');
		expect(testQuery.values).toEqual(['test2', 99]);
	});

	it("should return n+1 values when updating n amounts of properties", ()=> {
		let testQuery = sqlForPartialUpdate('customers',{name:'test3',deleteme:'please',four:4},'cust_id',101);
		expect(testQuery.values.length).toEqual(4);
	});

});