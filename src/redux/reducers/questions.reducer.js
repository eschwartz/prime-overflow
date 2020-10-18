const questionsReducer = (state = [], action) => {
  switch (action.type) {
    case 'SET_QUESTIONS':
      return action.payload
    default:
      return state;
  }
}

export const activeQuestion = (state = {}, action) => {
  switch (action.type) {
    case 'SET_ACTIVE_QUESTION':
      return action.payload;
    default:
      return state;
  }
}

export default questionsReducer;