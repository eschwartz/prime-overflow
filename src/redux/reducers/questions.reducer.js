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
    case 'EDIT_QUESTION':
      return {...state, ...action.payload};
    default:
      return state;
  }
}

export default questionsReducer;