const express = require('express');
const pool = require('../modules/pool');
const {rejectUnauthenticated} = require('../modules/authentication-middleware');
const router = express.Router();

router.post('/', rejectUnauthenticated, async (req, res, next) => {
  try {
    // Basic input validation
    for (let key of ['title', 'details']) {
      if (!req.body.hasOwnProperty(key)) {
        res.status(400)
          .json({ message: `missing required field: ${key}`});
        return
      }
    }

    const dbRes = await pool.query(`
      INSERT INTO "question" ("title", "details" , "authorId")
      VALUES ($1, $2, $3)
      RETURNING *
    `, [req.body.title, req.body.details, req.user.id]);

    res.status(201).json(dbRes.rows[0]);
  }
  catch (err) {
    next(err);
  }
});

router.put('/:id', rejectUnauthenticated, async(req, res, next) => {
  try {
    const send404 = () => 
      res.status(404).send({ message: `Question ${req.params.id} does not exist`});
    
    // Basic input validation
    for (let key of ['title', 'details']) {
      if (!req.body.hasOwnProperty(key)) {
        res.status(400)
          .json({ message: `missing required field: ${key}`});
        return
      }
    }

    // Send a 404, if the user does not have access
    if (!(await mayUserModify(req.user, req.params.id))) {
      return send404();
    }

    // Update the record
    const dbRes = await pool.query(`
      UPDATE "question"
      SET title = $1, details = $2
      WHERE id = $3
      RETURNING *;
    `, [req.body.title, req.body.details, req.params.id]);

    // Return a 404, if no record was updtead
    if (dbRes.rows.length === 0) {
      return send404();
    }

    // Send back the updated row
    res.send(dbRes.rows[0]);
  }
  catch (err) {
    next(err);
  }
})

router.delete('/:id', rejectUnauthenticated, async(req, res, next) => {
  try {
    // Send a 404, if the user does not have access
    if (!(await mayUserModify(req.user, req.params.id))) {
      res.status(404).send({ 
        message: `Question ${req.params.id} does not exist`
      });
      return;
    }

    // DELETE the record
    const dbRes = await pool.query(`
      DELETE FROM "question"
      WHERE id = $1
      RETURNING *;
    `, [req.params.id]);

    // Send a 404, if no record was deleted
    if (dbRes.rows.length === 0) {
      res.status(404).send({ 
        message: `Question ${req.params.id} does not exist`
      });
      return;
    }

    res.sendStatus(204);
  }
  catch (err) {
    next(err);
  }
})

router.get('/', rejectUnauthenticated, async(req, res, next) => {
  try {
    const isInstructor = req.user.authLevel === 'INSTRUCTOR';
    const dbRes = await pool.query(`
      SELECT 
        question.id,
        question.title, 
        question.details,
        "user"."id" as "authorId",
        "user"."fullName" as "authorFullName",
        "user"."username" as "authorUsername",
        "cohort"."name" as "cohortName",
        "cohort"."id" as "cohortId",
        count(answer.id) as "answerCount",
        count(case answer."isAccepted" when TRUE then 1 else null END) as "acceptedAnswerCount"
      FROM "question"
      JOIN "user" on "user"."id" = "question"."authorId"
      JOIN "cohort" on "user"."cohortId" = "cohort"."id"
      FULL JOIN answer on answer."questionId" = question.id
      ${isInstructor ? '' : `
        WHERE "cohort"."id" = $1
      `}
      GROUP BY question.id, "user".id, cohort.id;
    `, isInstructor ? [] : [req.user.cohortId]);

    res.send(dbRes.rows.map(row => ({
      id: row.id,
      title: row.title,
      details: row.details,
      answerCount: Number(row.answerCount),
      hasAcceptedAnswer: row.acceptedAnswerCount > 0,
      author: {
        id: row.authorId,
        fullName: row.authorFullName,
        username: row.authorUsername,
        cohort: {
          id: row.cohortId,
          name: row.cohortName
        },
      }
    })));
  }
  catch (err) {
    next(err);
  }
})

async function mayUserModify(user, questionId) {
  if (user.authLevel === 'INSTRUCTOR') {
    return true;
  }

  const dbRes = await pool.query(`
    SELECT * FROM "question" 
    WHERE question.id = $1;
  `, [questionId]);

  return (
    dbRes.rows.length !== 0 &&
    dbRes.rows[0].authorId === user.id
  );
}

module.exports = router;
