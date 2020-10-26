/**
 * End goal:
 * Update a user's cohort
 * 
 * PUT /api/user/:id
 * {
 *    cohortId: 1
 * }
 */

// Tell pool.js to use the test database
process.env.TEST = true;

// Setup supertest
const supertest = require('supertest');
const app = require('../../server/server');
const agent = supertest.agent(app);

const pool = require('../../server/modules/pool');

describe('Updating a users cohort', () => {
  let user;

  beforeEach(async() => {
    // Clean up my user table
    await pool.query('DELETE FROM "user"')

    // SETUP: Register a new user
    let registerRes = await agent
      .post('/api/user/register')
      .send({
        username: 'edan123',
        password: 'testpass',
        fullName: 'Edan Schwartz'
      });
    expect(registerRes.statusCode).toBe(201);
    user = registerRes.body;
    expect(user.username).toBe('edan123');

    // SETUP: make our user an instructor
    await pool.query(`
      UPDATE "user"
      SET "authLevel" = 'INSTRUCTOR'
      WHERE "id" = $1
    `, [user.id]);

    // SETUP: Login as our new user
    let loginRes = await agent
      .post('/api/user/login')
      .send({ username: 'edan123', password: 'testpass' });
    expect(loginRes.statusCode).toBe(200);
  });

  test(`should update a users cohortId`, async() => {
    // PUT /user/:id
    // to update the user's cohort
    let putResponse = await agent
      .put(`/api/user/${user.id}`)
      .send({
        cohortId: 1
      });

    expect(putResponse.statusCode).toBe(200);
    // Student cohort should be updated
    // and I should see that in the response body
    expect(putResponse.body).toMatchObject({
      cohortId: 1
    });
  });
  
  test(`should fail, if you're not logged in`, async() => {
    let logoutRes = await agent.post('/api/user/logout');
    expect(logoutRes.statusCode).toBe(200);

    // Attempt to update the user's cohort
    let putResponse = await agent
      .put(`/api/user/${user.id}`)
      .send({
        cohortId: 1
      });

    expect(putResponse.statusCode).toBe(403);
  });
  
  test(`should only allow instructors`, async() => {
    // Make our user a student
    // so it fails
    await pool.query(`
      UPDATE "user"
      SET "authLevel" = 'STUDENT'
      WHERE "id" = $1
    `, [user.id]);

    // Attempt to update the user's cohort
    let putResponse = await agent
      .put(`/api/user/${user.id}`)
      .send({
        cohortId: 1
      });

    expect(putResponse.statusCode).toBe(403);
  });
  
  test(`should fail if you give it a string as the cohortId`, async() => {
    let putResponse = await agent
      .put(`/api/user/${user.id}`)
      .send({
        cohortId: 'foobaloo'
      });

    expect(putResponse.statusCode).toBe(500);
  });
  
  test(`should fail if cohortId doesnt match an actual cohort`, async() => {
    let putResponse = await agent
      .put(`/api/user/${user.id}`)
      .send({
        cohortId: 999999999
      });

    expect(putResponse.statusCode).toBe(500);
  });
});
