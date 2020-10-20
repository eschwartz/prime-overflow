const questionsReducer = (state = [], action) => {
  switch (action.type) {
    case 'SET_QUESTIONS':
      return action.payload
    default:
      return state;
  }
}

export const questionToEdit = (state = {}, action) => {
  switch (action.type) {
    case 'SET_QUESTION_TO_EDIT':
      return action.payload;
    case 'UPDATE_QUESTION_TO_EDIT':
      return {...state, ...action.payload};
    case 'CLEAR_QUESTION_TO_EDIT':
      return {
        title: '',
        details: ''
      };
    default:
      return state;
  }
}

export default questionsReducer;