
const express = require('express');
require('dotenv').config();

const app = express();
const bodyParser = require('body-parser');
const sessionMiddleware = require('./modules/session-middleware');

const passport = require('./strategies/user.strategy');

// Route includes
const userRouter = require('./routes/user.router');
const questionRouter = require('./routes/question.router');
const answerRouter = require('./routes/answer.router');

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Passport Session Configuration //
app.use(sessionMiddleware);

// start up passport sessions
app.use(passport.initialize());
app.use(passport.session());


/* Routes */
app.use('/api/user', userRouter);
app.use('/api/question', questionRouter);
app.use('/api/answer', answerRouter);


// Error handler middleware
app.use((err, req, res, next) => {
  message = process.env.PRODUCTION === 'true' ?
    'something went wrong' :
    err.toString();

  console.error(err);

  res.status(500).json({ message });
});

// Serve static files
app.use(express.static('build'));

// App Set //
const PORT = process.env.PORT || 5000;

/** Listen * */
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});


// Export our express app
// so we can test against it
// with supertest
module.exports = app;