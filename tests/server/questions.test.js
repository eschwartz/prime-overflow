process.env.TEST = 'true';

const app = require('../../server/server');
const pool = require('../../server/modules/pool')
const testServer = require('supertest');

describe('Creating and getting questions', () => {

  beforeEach(async () => {
    // Reset the user table
    await pool.query(`DELETE FROM "user"`)
  });

  test('should GET questions', async() => {
    const agent = testServer(app);
    // Register
    const registerRes = await agent
      .post('/api/user/register')
      .send({ username: 'edan', password: 'testpass3', fullName: 'Edan' });

    expect(registerRes.statusCode).toBe(201);

    // Login
    const loginRes = await agent
      .post('/api/user/login')
      .send({ username: 'edan', password: 'testpass3' });
    
    expect(loginRes.statusCode).toBe(200);

    // GET /question
    const res = await agent
      .get('/api/user/current')

    expect(res.statusCode).toBe(200);
  });

  test('should only return questions from the students cohort', () => {

  });

  test('should allow instructors to see questions from any cohort', () => {

  });

  test('should return a 404, if no question matches', () => {

  });

});