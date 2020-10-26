// Use a test database!
process.env.TEST = true;

const pool = require('../../server/modules/pool');

// Setup supertest
const supertest = require('supertest');
const app = require('../../server/server');
// Create a supertest "agent" to make API requests
const agent = supertest.agent(app);

describe('Add user to cohort', () => {

  beforeEach(async() => {
    // Empty the user table, before each test
    await pool.query('DELETE FROM "user"')
  })

  test(`should update a user's cohort`, async () => {
    // Register a new user
    let student = await agent
      .post('/api/user/register')
      .send({ username: 'Mike', password: 'testpass', fullName: 'Mike S' });
    
    // Register should succeed
    expect(student.statusCode).toBe(201);
    let studentId = student.body.id;

    // Student ID should be an integer
    expect(Number.isInteger(studentId)).toBe(true);

    // Update the student's cohort
    let updateRes = await agent
      .put(`/api/user/${studentId}`)
      .send({ cohortId: 1 });

    expect(updateRes.statusCode).toBe(200);
    expect(updateRes.body).toBe({
      username: 'Mike',
      fullName: 'Mike S',
      cohortId: 1
    });
  });

  test(`should fail, if not logged in`, () => {

  });

  test(`should only allow instructors`, () => {

  });

  test(`should not allow changing username or password`, () => {

  });

})