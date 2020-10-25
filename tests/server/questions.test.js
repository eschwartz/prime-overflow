process.env.TEST = 'true';

const app = require('../../server/server');
const pool = require('../../server/modules/pool')
const testServer = require('supertest');

describe('Creating and getting questions', () => {

  beforeEach(async () => {
    // Reset question table
    await pool.query(`DELETE FROM "question"`);

    // Reset the user table
    await pool.query(`DELETE FROM "user"`);
  });

  test('should GET questions', async() => {
    const agent = testServer.agent(app);
    
    // Register
    const registerRes = await agent
      .post('/api/user/register')
      .send({ username: 'edan', password: 'testpass', fullName: 'Edan' });

    expect(registerRes.statusCode).toBe(201);

    // Login
    const loginRes = await agent
      .post('/api/user/login')
      .send({ username: 'edan', password: 'testpass' });
    
    expect(loginRes.statusCode).toBe(200);

    // Create a question
    const createRes = await agent
      .post('/api/question')
      .send({
        title: 'How do you write integration tests?',
        details: 'Testing is so fun!'
      })
    
    expect(createRes.statusCode).toBe(201);


    // GET /question
    const res = await agent
      .get('/api/question')

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0]).toMatchObject({
      title: 'How do you write integration tests?',
      details: 'Testing is so fun!',
    });
  });

  test('should only return questions from the students cohort', () => {

  });

  test('should allow instructors to see questions from any cohort', () => {

  });

  test('should return a 404, if no question matches', () => {

  });

});