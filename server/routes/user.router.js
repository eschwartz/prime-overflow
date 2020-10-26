const express = require('express');
const {
  rejectUnauthenticated,
} = require('../modules/authentication-middleware');
const encryptLib = require('../modules/encryption');
const pool = require('../modules/pool');
const userStrategy = require('../strategies/user.strategy');

const router = express.Router();

// Handles Ajax request for user information if user is authenticated
router.get('/current', rejectUnauthenticated, (req, res) => {
  // Send back user object from the session (previously queried from the database)
  res.send(req.user);
});

router.put('/:id', (req, res) => {
  pool.query(`
    UPDATE "user" 
    SET "cohortId" = $1
    WHERE id = $2
    RETURNING *
  `, [req.body.cohortId, req.params.id])
    .then(dbRes => {
      let student = dbRes.rows[0];
      delete student.password;
      res.send(student);
    })
    .catch(err => {
      console.error(err);
      res.send(500);
    })
});

// Handles POST request with new user data
// The only thing different from this and every other post we've seen
// is that the password gets encrypted before being inserted
router.post('/register', (req, res, next) => {
  const username = req.body.username;
  const fullName = req.body.fullName;
  const password = encryptLib.encryptPassword(req.body.password);

  const queryText = `
  INSERT INTO "user" ("fullName", username, password)
    VALUES ($1, $2, $3) RETURNING id`;
  pool
    .query(queryText, [fullName, username, password])
    .then((dbRes) => res.status(201).send(dbRes.rows[0]))
    .catch((err) => {
      next(err);
    });
});

// Handles login form authenticate/login POST
// userStrategy.authenticate('local') is middleware that we run on this route
// this middleware will run our POST if successful
// this middleware will send a 404 if not successful
router.post('/login', userStrategy.authenticate('local'), (req, res) => {
  res.sendStatus(200);
});

// clear all server session information about this user
router.post('/logout', (req, res) => {
  // Use passport's built-in method to log out the user
  req.logout();
  res.sendStatus(200);
});

module.exports = router;
