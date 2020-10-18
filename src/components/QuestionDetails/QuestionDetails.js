import React, { Component } from 'react';
import { connect } from 'react-redux';
import NewAnswer from './NewAnswer';

class QuestionDetails extends Component {
  state = {
    isAnswerMode: false
  };

  componentDidMount = () => {
    // Load questions from server, if this one is missing
    if (!this.props.question) {
      this.props.dispatch({
        type: 'FETCH_QUESTIONS',
      });
    }
  }

  toggleNewAnswerMode = () => {
    this.setState({
      isNewAnswerMode: !this.state.isNewAnswerMode
    });
  }

  onSubmitAnswer = () => {
    alert('TODO: submit');
  }

  render() {
    const question = this.props.question;

    // Handle missing question
    if (!question) {
      return <h2>404: Question Not Found</h2>
    }
    
    // Question are editable by the author,
    // or by any instructor
    const canEdit = (
      this.props.user.authLevel === 'INSTRUCTOR' ||
      question.author.id === this.props.user.id
    );



    return (
      <>
        {/* The Question  */}
        <h2>{question.title}</h2>
        <div>
          {question.details}
        </div>
        <em>Asked by {question.author.fullName}</em>

        <div>
          {canEdit && 
            <button onClick={this.onEdit}>Edit Question</button>
          }
        </div>

        {this.state.isNewAnswerMode ?
          // Answer mode
          <NewAnswer 
            onSubmit={this.onSubmitAnswer}
            onCancel={this.toggleNewAnswerMode}
          />
          :
          // Not answer mode
          <div>
              <button onClick={this.toggleNewAnswerMode}>
                Submit an Answer
              </button>
            </div>
        }
      </>
    );
  }
}

export default connect((store, props) => ({
  // Find a question in the store
  // with an ID that matches the /:id URL param
  // 
  // NOTE: this will be undefined on page reload,
  // so we'll need to check the value, and do a fetch
  // as needed.
  question: store.questions
    .filter(q => q.id === Number(props.match.params.id))[0],
  user: store.user,
}))(QuestionDetails);
