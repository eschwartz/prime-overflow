import React, { Component } from 'react';
import { connect } from 'react-redux';
import mapStoreToProps from '../../redux/mapStoreToProps';

class QuestionForm extends Component {


  componentDidMount = () => {
    this.init();
  }

  componentDidUpdate = (prevProps) => {
    this.init();
  }

  init() {
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
    // but the redux state `questionToEdit` has an id,
    // then we're looking at an old question
    // and we should clear it out
    else if (this.props.question.id) {
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

export default connect((store, props) => {
  // If we're in edit more
  // use the question from the redux store
  return {
    question: store.questionToEdit
  }
})(QuestionForm);
