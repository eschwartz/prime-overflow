// Use a test database!
process.env.TEST = true;

const pool = require('../../server/modules/pool');

// Setup supertest
const supertest = require('supertest');
const app = require('../../server/server');
// Create a supertest "agent" to make API requests
const agent = supertest.agent(app);

describe('Add user to cohort', () => {
  let user;

  beforeEach(async() => {
    // Empty the user table, before each test
    await pool.query('DELETE FROM "user"');


    // Register a new user
    let studentRes = await agent
      .post('/api/user/register')
      .send({ username: 'Edan', password: 'testpass', fullName: 'Edan S' });
    
    // Register should succeed
    expect(studentRes.statusCode).toBe(201);
    user = studentRes.body;

    // Student ID should be an integer
    expect(Number.isInteger(user.id)).toBe(true);

    // Make user an instructor
    await pool.query(`
      UPDATE "user" 
      SET "authLevel" = 'INSTRUCTOR'
      WHERE "user".id = $1
    `, [user.id]);

    // Login
    let loginRes = await agent
      .post('/api/user/login')
      .send({ username: 'Edan', password: 'testpass' });
    expect(loginRes.statusCode).toBe(200);
  })

  test(`should update a users cohort`, async () => {
    // Update the student's cohort
    let updateRes = await agent
      .put(`/api/user/${user.id}`)
      .send({ cohortId: 1 });

    expect(updateRes.statusCode).toBe(200);
    expect(updateRes.body).toMatchObject({
      id: user.id,
      authLevel: 'INSTRUCTOR',
      username: 'Edan',
      fullName: 'Edan S',
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
      .put(`/api/user/${user.id}`)
      .send({ cohortId: 1 });
    
    expect(updateRes.statusCode).toBe(403);
  });

  test(`should only allow instructors`, async() => {
    // Make logged-in user a student
    await pool.query(`
      UPDATE "user"
      SET "authLevel" = 'STUDENT'
      WHERE id = $1
    `, [user.id]);

    // Attempt to update user (should fail)
    let updateRes = await agent
     .put(`/api/user/${user.id}`)
     .send({ cohortId: 1 });
   
    expect(updateRes.statusCode).toBe(403);
  });

  test(`should not return the users password`, async() => {
    // Update the student username / password
    let updateRes = await agent
      .put(`/api/user/${user.id}`)
      .send({ cohortId: 1, username: 'newUser' });

    expect(updateRes.statusCode).toBe(200);
    expect(updateRes.body.password).toBe(undefined);
  });

})