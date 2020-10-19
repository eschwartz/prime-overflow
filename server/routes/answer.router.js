const express = require('express');
const pool = require('../modules/pool');
const {rejectUnauthenticated} = require('../modules/authentication-middleware');
const router = express.Router();

router.get('/', rejectUnauthenticated, async (req, res, next) => {
  try {
    const [queryString, queryParams] = 
      req.user.authLevel === 'INSTRUCTOR' ?
        // Instructors can see all answers
        [`
          SELECT * FROM "answer";
        `, []] :
        // Students may only see answers to questions
        // from their own cohort
        [`
          SELECT "answer".* FROM "answer"
          JOIN question on answer."questionId" = question.id
          JOIN "user" on question."authorId" = "user".id
          WHERE "user"."cohortId" = $1;
        `, [req.user.cohortId]]

    const dbRes = await pool.query(queryString, queryParams);
    res.send(dbRes.rows);
  }
  catch (err) {
    next(err);
  }
})

router.post('/', rejectUnauthenticated, async (req, res) => {
  try {
    for (let prop of ['questionId', 'details']) {
      if (!req.body.hasOwnProperty(prop)) {
        res.status(400).send({
          message: `Missing required field: ${prop}`
        });
        return;
      }
    }

    const dbRes = await pool.query(`
      INSERT INTO "answer" 
        ("details", "authorId", "questionId")
      VALUES ($1, $2, $3)
      RETURNING *;
    `, [req.body.details, req.user.id, req.body.questionId]);

    res.status(201).send(dbRes.rows[0]);
  }
  catch(err) {
    next(err);
  }

});

module.exports = router;