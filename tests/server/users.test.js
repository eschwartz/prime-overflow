// Use a test database!
process.env.TEST = true;

const pool = require('../../server/modules/pool');

// Setup supertest
const supertest = require('supertest');
const app = require('../../server/server');
// Create a supertest "agent" to make API requests
const agent = supertest.agent(app);

describe('Add user to cohort', () => {
  let student;

  beforeEach(async() => {
    // Empty the user table, before each test
    await pool.query('DELETE FROM "user"');


    // Register a new user
    let studentRes = await agent
      .post('/api/user/register')
      .send({ username: 'Mike', password: 'testpass', fullName: 'Mike S' });
    
    // Register should succeed
    expect(studentRes.statusCode).toBe(201);
    student = studentRes.body;

    // Student ID should be an integer
    expect(Number.isInteger(student.id)).toBe(true);

    // Login
    let loginRes = await agent
      .post('/api/user/login')
      .send({ username: 'Mike', password: 'testpass' });
    expect(loginRes.statusCode).toBe(200);
  })

  test(`should update a users cohort`, async () => {
    // Update the student's cohort
    let updateRes = await agent
      .put(`/api/user/${student.id}`)
      .send({ cohortId: 1 });

    expect(updateRes.statusCode).toBe(200);
    expect(updateRes.body).toMatchObject({
      id: student.id,
      authLevel: 'STUDENT',
      username: 'Mike',
      fullName: 'Mike S',
      cohortId: 1,
    });
  });

  test(`should fail, if not logged in`, async () => {
    // Logout
    let logoutRes = await agent
      .post('/api/user/logout');
    expect(logoutRes.statusCode).toBe(200);

    // Attempt to update user (should fail)
    let updateRes = await agent
      .put(`/api/user/${student.id}`)
      .send({ cohortId: 1 });
    
    expect(updateRes.statusCode).toBe(403);
  });

  test(`should only allow instructors`, () => {

  });

  test(`should not allow changing username or password`, () => {

  });

})