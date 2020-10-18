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

module.exports = router;
