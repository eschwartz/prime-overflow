const questionsReducer = (state = [], action) => {
  switch (action.type) {
    case 'SET_QUESTIONS':
      return action.payload
    default:
      return state;
  }
}

// Mange a "draft" of the question,
// which is ready to be saved
export const draftQuestion = (state = null, action) => {
  switch (action.type) {
    case 'SET_DRAFT_QUESTION':
      return action.payload;
    default:
      return state;
  }
}

export default questionsReducer;