import React, {useState} from 'react';

function NewAnswer(props) {
  const [details, setDetails] = useState('');

  return (
    <>
      <h3>Your Answer</h3>
      <textarea 
        value={details} 
        onChange={evt => setDetails(evt.target.value)}
      ></textarea>

      <div>
        <button onClick={props.onCancel}>
          Cancel
        </button>
        <button onClick={() => props.onSubmit(details)}>
          Submit
        </button>
      </div>
    </>
  )
}

export default NewAnswer;