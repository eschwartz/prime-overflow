import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Link} from 'react-router-dom';

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
    return (
      <>
        <h1>Questions Search</h1>

        <ul>
          {this.props.questions.map(question => 
            <>
              <h3>
                <Link to={`/questions/${question.id}`}>{question.title}</Link>
              </h3>
              <div>{this.truncateDetails(question.details, 20)}</div>
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
