const express = require('express');
const pool = require('../modules/pool');
const {rejectUnauthenticated} = require('../modules/authentication-middleware');
const router = express.Router();

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