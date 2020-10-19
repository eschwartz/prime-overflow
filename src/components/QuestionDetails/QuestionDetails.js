import React, { Component } from 'react';
import { connect } from 'react-redux';
import NewAnswer from './NewAnswer';

class QuestionDetails extends Component {
  state = {
    isAnswerMode: false,
    isEditQuestionMode: false
  };

  componentDidMount = () => {
    // Load questions from server, if this one is missing
    if (!this.props.question) {
      this.props.dispatch({
        type: 'FETCH_QUESTIONS',
      });
    }

    this.props.dispatch({
      type: 'FETCH_ANSWERS',
    });
  }

  toggleNewAnswerMode = () => {
    this.setState({
      isNewAnswerMode: !this.state.isNewAnswerMode
    });
  }

  toggleEditQuestionMode = () => {
    this.setState({
      isEditQuestionMode: !this.state.isEditQuestionMode
    });
  }

  onSubmitAnswer = (answerDetails) => {
    this.props.dispatch({
      type: 'CREATE_ANSWER',
      payload: {
        details: answerDetails,
        questionId: this.props.question.id
      }
    });
    
    this.toggleNewAnswerMode();
  }

  updateDraftQuestion = (evt, prop) => {
    this.props.dispatch({
      type: 'SET_DRAFT_QUESTION',
      payload: {
        ...this.props.draftQuestion,
        [prop]: evt.target.value
      }
    });
  }

  onSaveQuestionDraft = () => {
    // Make sure the draft is up-to-date
    this.props.dispatch({
      type: 'SET_DRAFT_QUESTION',
      payload: this.props.draftQuestion
    });

    // Persist the changes to the draft question
    this.props.dispatch({
      type: 'SAVE_DRAFT_QUESTION'
    });

    // Get out of "edit mode"
    this.toggleEditQuestionMode();
  }

  render() {
    console.log('props', this.props);
    console.log('state', this.state);
    const question = this.props.question;
    const draftQuestion = this.props.draftQuestion;

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
        {/* Edit Question */}
        {this.state.isEditQuestionMode ?
          <>
            {/* Edit Question Title */}
            <h2>
              <input 
                type="text"
                value={draftQuestion.title}
                onChange={(evt) => this.updateDraftQuestion(evt, 'title')}
              />
            </h2>
            {/* Edit Question Details */}
            <div>
              <textarea 
                value={draftQuestion.details}
                onChange={(evt) => this.updateDraftQuestion(evt, 'details')}
              />
            </div>
            {/* Save / Cancel buttons */}
            <div>
              <button onClick={this.toggleEditQuestionMode}>Cancel</button>
              <button onClick={this.onSaveQuestionDraft}>Save Question</button>
            </div>
          </>
          :
          <div>
            {/* Display Question  */}
            <h2>{question.title}</h2>
            <div>
              {question.details}
            </div>
            <em>Asked by {question.author.fullName}</em>
            {canEdit && 
              <button onClick={this.toggleEditQuestionMode}>Edit Question</button>
            }
          </div>
        }

        {/* Answer question form */}
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

        {/* List of Answers */}
        {this.props.answers.length === 0 ?
          <h3>No Answers yet :-(</h3> :
          <>
            <h3>Answers</h3>
            {this.props.answers.map(answer => 
              <div key={answer.id}>
                <div>{answer.details}</div>
                <em>Answered by {answer.author.fullName}</em>
              </div>
            )}
          </>
        }
      </>
    );
  }
}

export default connect((store, props) => {
  // Find a question in the store
  // with an ID that matches the /:id URL param
  // 
  // NOTE: this will be undefined on page reload,
  // so we'll need to check the value, and do a fetch
  // as needed.
  const question = store.questions
    .filter(q => q.id === Number(props.match.params.id))[0]


  // Find answers for this question
  const answers = question && store.answers
    .filter(answer => answer.questionId === question.id);

  return {
    question,
    draftQuestion: store.draftQuestion || question,
    answers,
    user: store.user,
  }
})(QuestionDetails);
