import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Link} from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';

const styles = {
  paper: {
    padding: 20,
    background: "peachpuff",
    '& a': {
      display: 'inline-block',
      color: 'green',
      '&:hover': {
        color: 'orange',
        textDecoration: 'none',
        transform: 'rotate(180deg)'
      }
    }
  }
};

class QuestionList extends Component {

  componentDidMount = () => {
    this.props.dispatch({
      type: 'FETCH_QUESTIONS'
    })
  };

  truncateDetails = (details, maxWords) => {
    let words = details.split(' ');
    if (words.length <= maxWords) {
      return details;
    }
    return words.slice(0, maxWords - 1).join(' ') + '...';
  }

  render() {
    const classes = this.props.classes;
    return (
      <Container maxWidth="lg">
        <h1>Questions Search</h1>

        <Grid container spacing={3}>
          {this.props.questions.map(question => 
            <Grid item xs={12} md={6} lg={3} key={question.id}>
              <Paper className={classes.paper}>
                <h3>
                  <Link to={`/questions/${question.id}`}>{question.title}</Link>
                </h3>
                <div>{this.truncateDetails(question.details, 20)}</div>
                <div>-- {question.author.fullName} ({question.author.cohort.name})</div>
              </Paper>
            </Grid>
          )}
        </Grid>
      </Container>
    );
  }
}

export default connect(store => ({
  questions: store.questions
}))(withStyles(styles)(QuestionList));
