import React, { Component } from 'react';
import { connect } from 'react-redux';
import mapStoreToProps from '../../redux/mapStoreToProps';

class NewQuestion extends Component {
  state = {
    title: '',
    details: '',
  };

  onChange = (prop, evt) => {
    this.setState({
      [prop]: evt.target.value
    });
  }

  onSubmit = () => {
    this.props.dispatch({
      type: 'CREATE_QUESTION',
      payload: {
        question: this.state,
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
              value={this.state.title} 
              onChange={(evt) => this.onChange('title', evt)}
            />
          </label>
        </div>

        <div>
          <label>
            <div>Details</div>
            <textarea 
              style={{width: 500, height: 300}}
              value={this.state.details} 
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

export default connect(mapStoreToProps)(NewQuestion);
