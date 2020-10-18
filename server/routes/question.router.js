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

router.get('/', rejectUnauthenticated, async(req, res, next) => {
  try {
    // TODO: Only show 
    if (req.user.authLevel !== "INSTRUCTOR") {
      res.status(500).send({
        message: "Student question search not yet implemented"
      });
      return;
    }

    // TODO Allow filtering by cohort, for instructor
    const dbRes = await pool.query(`
      SELECT 
        question.title, 
        question.details,
        "user"."id" as "authorId",
        "user"."fullName" as "authorFullName",
        "user"."username" as "authorUsername"
      FROM "question"
      JOIN "user" on "user"."id" = "question"."authorId";
    `);
    res.send(dbRes.rows.map(row => ({
      title: row.title,
      details: row.details,
      author: {
        id: row.authorId,
        fullName: row.authorFullName,
        username: row.authorUsername
      }
    })));
  }
  catch (err) {
    next(err);
  }
})

module.exports = router;
