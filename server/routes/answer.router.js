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
          SELECT
            "answer".*, 
            "answerAuthor".id as "authorId",
            "answerAuthor"."fullName" as "authorFullName" 
          FROM "answer"
          JOIN "user" "answerAuthor" on answer."authorId" = "answerAuthor".id;
        `, []] :
        // Students may only see answers to questions
        // from their own cohort
        [`
          SELECT 
            "answer".*, 
            "answerAuthor".id as "authorId",
            "answerAuthor"."fullName" as "authorFullName"
          FROM "answer"
          JOIN question on answer."questionId" = question.id
          JOIN "user" "answerAuthor" on answer."authorId" = "answerAuthor".id 
          JOIN "user" "questionAuthor" on question."authorId" = "questionAuthor".id
          WHERE "questionAuthor"."cohortId" = $1;
        `, [req.user.cohortId]]

    const dbRes = await pool.query(queryString, queryParams);
    const rows = dbRes.rows.map(row => ({
      id: row.id,
      details: row.details,
      isAccepted: row.isAccepted,
      questionId: row.questionId,
      author: {
        id: row.authorId,
        fullName: row.authorFullName
      }
    }))
    res.send(rows);
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