import React, { Component } from 'react';
import { connect } from 'react-redux';
import mapStoreToProps from '../../redux/mapStoreToProps';

class QuestionForm extends Component {
  state = {
    title: '',
    details: '',
  };

  componentDidMount = () => {
    if (this.props.match.params.id) {
      this.props.dispatch({
        type: 'FETCH_QUESTION_TO_EDIT',
        payload: this.props.match.params.id
      });
    }
  }

  onChange = (prop, evt) => {
    this.props.dispatch({
      type: 'EDIT_QUESTION',
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
  if (!props.match.params.id) {
    return {
      question: {
        title: '',
        details: ''
      }
    };
  }

  return {
    question: store.questionToEdit
  };
})(QuestionForm);
