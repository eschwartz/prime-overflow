import React, { Component } from 'react';
import { connect } from 'react-redux';
import mapStoreToProps from '../../redux/mapStoreToProps';

class QuestionForm extends Component {


  componentDidMount = () => {
    this.refreshQuestion();
  }

  componentDidUpdate = (prevProps) => {
    // If our question ID has changed, 
    // we need to re-fetch data from the server (or reset the form)
    if (prevProps.question.id !== this.props.question.id) {
      this.refreshQuestion();
    }
  }

  refreshQuestion() {
    // If we're in "Edit" mode,
    // Fetch the question to edit
    if (this.props.match.params.id) {
      // /questions/edit/:id
      this.props.dispatch({
        type: 'FETCH_QUESTION_TO_EDIT',
        payload: Number(this.props.match.params.id)
      });
    }

    // If we're in CREATE mode (eg. /question/new)
    // clear any existing question data
    else {
      this.props.dispatch({
        type: 'CLEAR_QUESTION_TO_EDIT'
      });
    }
  }

  onChange = (prop, evt) => {
    // Update the redux store.questionToEdit,
    // with our new form values
    this.props.dispatch({
      type: 'UPDATE_QUESTION_TO_EDIT',
      payload: {
        [prop]: evt.target.value
      }
    });
  }

  onSubmit = () => {
    this.props.dispatch({
      type: 'PERSIST_QUESTION',
      payload: {
        question: this.props.question,
        onCreate: (question) => {
          this.props.history.push(`/questions/${question.id}`);
        }
      }
    });
  }

  render() {
    return (
      <>
        <h2>Ask a Question</h2>

        <div>
          <label>
            <div>Title</div>
            <textarea 
              value={this.props.question.title} 
              onChange={(evt) => this.onChange('title', evt)}
            />
          </label>
        </div>

        <div>
          <label>
            <div>Details</div>
            <textarea 
              style={{width: 500, height: 300}}
              value={this.props.question.details} 
              onChange={(evt) => this.onChange('details', evt)}
            />
          </label>
        </div>

        <div>
          <button onClick={this.onSubmit}>Submit!</button>
        </div>
      </>
    );
  }
}

export default connect((store) => ({
  question: store.questionToEdit
}))(QuestionForm);
