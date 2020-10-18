import React, { Component } from 'react';
import { connect } from 'react-redux';

class QuestionList extends Component {

  componentDidMount = () => {
    this.props.dispatch({
      type: 'FETCH_QUESTIONS'
    })
  };

  render() {
    return (
      <>
        <h1>Questions Search</h1>

        <ul>
          {this.props.questions.map(question => 
            <>
              <h3>{question.title}</h3>
              <div>{question.details}</div>
              <div>-- {question.author.fullName} ({question.author.cohort.name})</div>
            </>
          )}
        </ul>
      </>
    );
  }
}

export default connect(store => ({
  questions: store.questions
}))(QuestionList);
