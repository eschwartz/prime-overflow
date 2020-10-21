import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Link} from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import { withStyles } from '@material-ui/core';

const styles = {
  paper: {
    padding: 20,
    background: 'peachpuff',
    // .paper h3 { margin-top: 0; }
    '& h3': {
      marginTop: 0,
    },
    '& h3:hover': {
      color: 'green',
      transform: 'rotate(180deg)'
    }
  }
};


function MyAwesomeGrid(props) {
  return (
    <Grid container spacing={5}>
      {props.items.map(item => 
        <Grid item xs={12} sm={6} md={3} key={item.id}>
          <Paper className={props.classes.paper}>
            <h3>{item.title}</h3>
            <div>{item.details}</div>
          </Paper>
        </Grid>
      )}
    </Grid>
  )
}

const StyledGrid = withStyles(styles)(MyAwesomeGrid);


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
      <Container maxWidth="md">
        <h1>Questions Search</h1>

        <StyledGrid 
          items={this.props.questions}
        />
      </Container>
    );
  }
}


export default connect(store => ({
  questions: store.questions
}))(withStyles(styles)(QuestionList));



