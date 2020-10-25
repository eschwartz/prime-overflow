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
  const sendMissingError = () => 
    res.status(404).send({ message: `Question ${req.params.id} does not exist`});

  
  // Basic input validation
  for (let key of ['title', 'details']) {
    if (!req.body.hasOwnProperty(key)) {
      res.status(400)
        .json({ message: `missing required field: ${key}`});
      return
    }
  }

  try {
    if (req.user.authLevel !== 'INSTRUCTOR') {
      // For students, grab the question first, 
      // to make sure we access to update.
      const dbSelectRes = await pool.query(`
        SELECT * FROM "question" 
        WHERE question."authorId" = $1;
      `, [req.user.id]);
      if (dbSelectRes.rows.length === 0) {
        return sendMissingError();
      }
    }

    // Update the record
    const dbRes = await pool.query(`
      UPDATE "question"
      SET title = $1, details = $2
      WHERE id = $3
      RETURNING *;
    `, [req.body.title, req.body.details, req.params.id]);
    if (dbRes.rows.length === 0) {
      return sendMissingError();
    }
    res.send(dbRes.rows[0]);
    return;
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
        "cohort"."id" as "cohortId"
      FROM "question"
      JOIN "user" on "user"."id" = "question"."authorId"
      LEFT JOIN "cohort" on "user"."cohortId" = "cohort"."id"
      ${isInstructor ? ';' : `
        WHERE "cohort"."id" = $1
      `};
    `, isInstructor ? [] : [req.user.cohortId]);

    res.send(dbRes.rows.map(row => ({
      id: row.id,
      title: row.title,
      details: row.details,
      author: {
        id: row.authorId,
        fullName: row.authorFullName,
        username: row.authorUsername,
        cohort: {
          id: row.cohortId,
          name: row.cohortName
        }
      }
    })));
  }
  catch (err) {
    next(err);
  }
});


router.get('/:id', rejectUnauthenticated, async(req, res, next) => {
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
        "cohort"."id" as "cohortId"
      FROM "question"
      JOIN "user" on "user"."id" = "question"."authorId"
      JOIN "cohort" on "user"."cohortId" = "cohort"."id"
      WHERE question.id = $1
      ${isInstructor ? ';' : `
        AND "cohort"."id" = $2
      `};
    `, isInstructor ? 
      [req.params.id] : 
      [req.params.id, req.user.cohortId]
    );


    // Grab the first row
    let row = dbRes.rows[0];

    // Return a 404, if no results
    if (!row) {
      res.sendStatus(404);
      return;
    }

    res.send({
      id: row.id,
      title: row.title,
      details: row.details,
      author: {
        id: row.authorId,
        fullName: row.authorFullName,
        username: row.authorUsername,
        cohort: {
          id: row.cohortId,
          name: row.cohortName
        }
      }
    })
  }
  catch (err) {
    next(err);
  }
});

module.exports = router;
